// src/pages/Game.jsx

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Papa from 'papaparse';
import styles from './Game.module.css';
import FinalSummary from '../components/FinalSummary';
import CardBox from '../components/CardBox';


export default function Game() {
  const navigate = useNavigate();
  // read the deck URL passed from Home (or fall back to default)
  const { state } = useLocation();
  const csvUrl     = state?.csvUrl || '/data/cards.csv';
  // 1) Dynamic rounds loaded from CSV
  const [rounds, setRounds] = useState([]);
  const totalInitial = rounds.length;

  // 2) Columns for drag-and-drop
  const [columns, setColumns] = useState({
    doNotPass: [],
    central: [],
    pass: [],
    policyDeck: [],   // holds your 3 policies
    rank1:    [],   // droppable target for Rank 1
    rank2:    [],   // droppable target for Rank 2
    rank3:    []    // droppable target for Rank 3
  });

  // 3) Phase and all result buckets
  const [phase, setPhase]             = useState(0);
  const [passedCards, setPassedCards] = useState([]);
  const [rejectedCards, setRejectedCards] = useState([]);
  const [topThree, setTopThree]       = useState([]);
  const [bottomThree, setBottomThree] = useState([]);
  const [policyOne, setPolicyOne]     = useState([]);
  const [policyTwo, setPolicyTwo]     = useState([]);

  // holds 1|2|3 or null for each container
const [rankPhaseRanks, setRankPhaseRanks] = useState({
  policyOne: null,
  policyTwo: null,
  noPolicy:  null,
});

  useEffect(() => {
  fetch(csvUrl)
    .then(res => res.text())
    .then(csv => {
      // parse CSV into rows
      const { data } = Papa.parse(csv, { header: true });
      console.log('parsed CSV rows:', data);

      // group rows by round number
      const grouped = {};
      data.forEach(row => {
        const roundNum = parseInt(row.round, 10);
        const idx = roundNum - 1;
        if (!grouped[idx]) grouped[idx] = [];
        grouped[idx].push({
          id:   `r${roundNum}-card${grouped[idx].length + 1}`,
          text: row.text,
          icon: row.icon
        });
      });

      // build an array of rounds
      const roundList = Object.values(grouped);
      console.log('roundList:', roundList);

      // update state
      setRounds(roundList);
      setColumns({
        doNotPass: [],
        central: roundList[0] || [],
        pass: [],
      
      });
    })
    .catch(err => console.error(`Failed to load ${csvUrl}:`, err));
}, [csvUrl]);

const handleRankClick = key => {
  setRankPhaseRanks(prev => {
    const used = Object.values(prev).filter(v => v != null);
    const allRanks = [1, 2, 3];

    // if this box is un-ranked, give it the lowest unused rank
    if (prev[key] == null) {
      const next = allRanks.find(n => !used.includes(n)) ?? null;
      return { ...prev, [key]: next };
    }

    // if it already had a rank, clicking again clears it
    return { ...prev, [key]: null };
  });
};

    // PHASE constants (depends on rounds.length)
  const TOP_PHASE       = totalInitial;
  const BOTTOM_PHASE    = totalInitial + 1;
  const POLICY1_PHASE   = totalInitial + 2;
  const POLICY2_PHASE   = totalInitial + 3;
  const RANK_PHASE      = totalInitial + 4;   
  const DONE_PHASE      = totalInitial + 5;   

  // ─── click-to-rank readiness ───────────────────────────────
  const assigned = Object.values(rankPhaseRanks).filter(v => v != null);
  const readyRank =
    phase === RANK_PHASE && assigned.length === 3 && new Set(assigned).size === 3;

  const widthClass =
  phase < totalInitial || phase === POLICY1_PHASE || phase === POLICY2_PHASE
    ? styles.initialZone
    : styles.laterZone;

  const getBorderClass = id => {
  if (phase < totalInitial) {
    if (id === 'pass')       return styles.passZone;
    if (id === 'doNotPass')  return styles.notPassZone;
  }

  if (phase === TOP_PHASE && id === 'pass') return styles.topBottomZone;
  if (phase === BOTTOM_PHASE && id === 'doNotPass') return styles.topBottomZone;

  if (phase === POLICY1_PHASE || phase === POLICY2_PHASE) {
  if (id === 'central')     return styles.notPassZone;
  if (id === 'pass')        return styles.passZone; 
  if (id === 'doNotPass')   return styles.policyZone;
}
  return '';
};

const onDragEnd = result => {
  const { source, destination } = result;
  if (!destination) return;

  const moved = columns[source.droppableId][source.index];
  let allowed = false;

  if (phase < totalInitial) {
    // allow central → pass/doNotPass (but only if target is empty)
    if (
      source.droppableId === 'central' &&
      (destination.droppableId === 'pass' || destination.droppableId === 'doNotPass') &&
      columns[destination.droppableId].length < 1
    ) {
      allowed = true;
    }
    // allow returning from pass/doNotPass → central
    if (
      (source.droppableId === 'pass' || source.droppableId === 'doNotPass') &&
      destination.droppableId === 'central'
    ) {
      allowed = true;
    }
  } else if (phase === TOP_PHASE) {
    allowed =
      (source.droppableId === 'central' && destination.droppableId === 'pass') ||
      (source.droppableId === 'pass' && destination.droppableId === 'central');
  } else if (phase === BOTTOM_PHASE) {
    allowed =
      (source.droppableId === 'central' && destination.droppableId === 'doNotPass') ||
      (source.droppableId === 'doNotPass' && destination.droppableId === 'central');
  } else {
    // POLICY PHASES
    allowed =
      ((source.droppableId === 'central' || source.droppableId === 'pass') &&
        destination.droppableId === 'doNotPass') ||
      (source.droppableId === 'doNotPass' &&
        topThree.some(t => t.id === moved.id) &&
        destination.droppableId === 'pass') ||
      (source.droppableId === 'doNotPass' &&
        bottomThree.some(b => b.id === moved.id) &&
        destination.droppableId === 'central');
  }
  // ─── RANK PHASE ─────────────────────────────────────────────────────────────
if (phase === RANK_PHASE) {
  // allow deck → rank slot (only if empty)
  if (
    source.droppableId === 'policyDeck' &&
    ['rank1','rank2','rank3'].includes(destination.droppableId) &&
    columns[destination.droppableId].length === 0
  ) {
    allowed = true;
  }
  // allow rank slot → deck
  if (
    ['rank1','rank2','rank3'].includes(source.droppableId) &&
    destination.droppableId === 'policyDeck'
  ) {
    allowed = true;
  }
}

  if (!allowed) return;

  // Enforce pick limits
  if (
    phase === TOP_PHASE &&
    destination.droppableId === 'pass' &&
    columns.pass.length >= 3
  ) return;
  if (
    phase === BOTTOM_PHASE &&
    destination.droppableId === 'doNotPass' &&
    columns.doNotPass.length >= 3
  ) return;
  if (phase === POLICY1_PHASE && destination.droppableId === 'doNotPass') {
    const picks = columns.doNotPass;
    const fromPass = picks.filter(c => topThree.some(t => t.id === c.id)).length;
    const fromCentral = picks.filter(c => bottomThree.some(b => b.id === c.id)).length;
    if (source.droppableId === 'pass' && fromPass >= 2) return;
    if (source.droppableId === 'central' && fromCentral >= 1) return;
  }
  if (phase === POLICY2_PHASE && destination.droppableId === 'doNotPass') {
    const picks = columns.doNotPass;
    const fromPass = picks.filter(c => topThree.some(t => t.id === c.id)).length;
    const fromCentral = picks.filter(c => bottomThree.some(b => b.id === c.id)).length;
    if (source.droppableId === 'pass' && fromPass >= 1) return;
    if (source.droppableId === 'central' && fromCentral >= 2) return;
  }
  // don’t over‐fill any rank slot
if (
  phase === RANK_PHASE &&
  ['rank1','rank2','rank3'].includes(destination.droppableId) &&
  columns[destination.droppableId].length >= 1
) return;

  // Perform the move
  const srcList = Array.from(columns[source.droppableId]);
  const [card] = srcList.splice(source.index, 1);
  const dstList = Array.from(columns[destination.droppableId]);
  dstList.splice(destination.index, 0, card);

  setColumns({
    ...columns,
    [source.droppableId]: srcList,
    [destination.droppableId]: dstList
  });
};

  const handleNext = () => {
    if (!isReady) return

    if (phase < totalInitial) {
  const pickP = columns.pass[0]
  const pickR = columns.doNotPass[0]

  // build fresh arrays before updating state
  const newPassed   = [...passedCards, pickP]
  const newRejected = [...rejectedCards, pickR]

  setPassedCards(newPassed)
  setRejectedCards(newRejected)

  if (phase < totalInitial - 1) {
    setPhase(phase + 1)
    setColumns({
      doNotPass: [],
      central: rounds[phase + 1],
      pass: []
    })
  } else {
    setPhase(TOP_PHASE)
    setColumns({
      doNotPass: [],
      central: newPassed,   
      pass: []
    })
  }
  return
} else if (phase === TOP_PHASE) {
      setTopThree(columns.pass)
      setPhase(BOTTOM_PHASE)
      setColumns({ doNotPass: [], central: rejectedCards, pass: [] })
    } else if (phase === BOTTOM_PHASE) {
      const fb = columns.doNotPass
      setBottomThree(fb)
      setPhase(POLICY1_PHASE)
      setColumns({ doNotPass: [], central: fb, pass: [...topThree] })
    } else if (phase === POLICY1_PHASE) {
      setPolicyOne(columns.doNotPass)
      setPhase(POLICY2_PHASE)
      setColumns({ doNotPass: [], central: [...bottomThree], pass: [...topThree] })
    } else if (phase === POLICY2_PHASE) {
  setPolicyTwo(columns.doNotPass);

  // advance into the ranking phase
  setPhase(RANK_PHASE);
  setColumns(prev => ({
    ...prev,
    policyDeck: [
      { id: 'rank-p1',   text: 'Policy 1'   },
      { id: 'rank-p2',   text: 'Policy 2'   },
      { id: 'rank-none', text: 'No Policy' }
    ],
    rank1: [],
    rank2: [],
    rank3: []
  }));

} else if (phase === RANK_PHASE) {
  // once all three ranks filled, finish
  setPhase(DONE_PHASE);
}
}; 

  const readyInitial     = phase < totalInitial     && columns.pass.length === 1    && columns.doNotPass.length === 1
  const readyTopThree    = phase === TOP_PHASE      && columns.pass.length === 3
  const readyBottomThree = phase === BOTTOM_PHASE   && columns.doNotPass.length === 3
  const readyPolicy1     = phase === POLICY1_PHASE  && columns.doNotPass.length === 3
  const readyPolicy2 = phase === POLICY2_PHASE && columns.doNotPass.length === 3

// overall readiness now includes the rank phase
const isReady = 
  readyInitial     ||
  readyTopThree    ||
  readyBottomThree ||
  readyPolicy1     ||
  readyPolicy2     ||
  readyRank

  let buttonLabel;
if (phase < totalInitial - 1) {
  // all but the last initial round
  buttonLabel = 'Next Stage';
} else if (phase === totalInitial - 1) {
  // the very last initial round
  buttonLabel = 'Next Phase';
} else if (phase === TOP_PHASE || phase === BOTTOM_PHASE) {
  buttonLabel = 'Next Phase';
} else if (phase === POLICY1_PHASE) {
  buttonLabel = 'Next';
} else if (phase === POLICY2_PHASE) {
  buttonLabel = 'Next Phase';
} else {
  buttonLabel = 'Finish';
}

let headerElement;
if (phase < totalInitial) {
  headerElement = (
    <>
      <h2 className={styles.headerTitle}>
        Choose your preference for one rule that should “pass” into policy, and one that should definitely “not pass”. You should leave one card in the middle.

      </h2>
      <h2 className={styles.headerTitle}>
        Stage {phase + 1} of {totalInitial}
      </h2>
    </>
  );
} else if (phase === TOP_PHASE) {
  headerElement = (
    <h2 className={styles.headerTitle}>
      It’s time to choose your priorities! Pick your Top 3 “Pass” cards from the cards that you already passed.
    </h2>
  );
} else if (phase === BOTTOM_PHASE) {
  headerElement = (
    <h2 className={styles.headerTitle}>
      Now Pick your Bottom 3 “Not Pass” cards. These are your least favorite from the cards you decided to not pass.

    </h2>
  );
} else if (phase === POLICY1_PHASE) {
  headerElement = (
    <h2 className={styles.headerTitle}>
      Now, you will combine cards from your top 3 and bottom 3 to create a policy of 3 rules. You will have to compromise, because all 3 cards will make it into the final policy.
    </h2>
  );
} else if (phase === POLICY2_PHASE) {
  headerElement = (
    <h2 className={styles.headerTitle}>
      Now, you will combine cards from your top 3 and bottom 3 to create a policy of 3 rules. You will have to compromise, because all 3 cards will make it into the final policy.
    </h2>
  );
} else {
  headerElement = (
    <h2 className={styles.headerTitle}>
      Press on the containers to rank them from 1 - 3
    </h2>
  );
}

 let displayPhase;
  if (phase < totalInitial) {
    displayPhase = 1;
  } else if (phase === TOP_PHASE || phase === BOTTOM_PHASE) {
    displayPhase = 2;
  } else if (phase === POLICY1_PHASE || phase === POLICY2_PHASE) {
    displayPhase = 3;
  } else if (phase === RANK_PHASE) {
    displayPhase = 4;
  } else {
    displayPhase = ''; 
  }

  const policyPassCount = columns.doNotPass.filter(c =>
  topThree.some(t => t.id === c.id)
).length;
const policyCentralCount = columns.doNotPass.filter(c =>
  bottomThree.some(b => b.id === c.id)
).length;

  if (phase === DONE_PHASE) {
  return (
    <FinalSummary
      passedCards={passedCards}
      rejectedCards={rejectedCards}
      topThree={topThree}
      bottomThree={bottomThree}
      policyOne={policyOne}
      policyTwo={policyTwo}
      rankPhaseRanks={rankPhaseRanks}
    />
  )
}
  return (
  <>
    {/* Phase label now lives outside the game box */}
    <div className={styles.phaseIndicator}>
      Phase {displayPhase}
    </div>
    <div style={{ padding: '20px' }}>
      {headerElement}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>

          {/* INITIAL ROUNDS */}
{phase < totalInitial && (
  <>
    {/* Pass on the left */}
    <Droppable droppableId="pass">
      {prov => (
        <div
          ref={prov.innerRef}
          {...prov.droppableProps}
          className={`${styles.zone} ${widthClass} ${getBorderClass('pass')}`}
          style={{
            // light green when 1/1 picked
            backgroundColor:
              columns.pass.length === 1 ? '#adf6ec' : undefined,
          }}
        >
          <h3
            className={styles.zoneTitle}
            style={{ backgroundColor: '#35d0ba' }}
          >
            Pass <span className={styles.counter}>{columns.pass.length}/1</span>
          </h3>
          {columns.pass.map((c, i) => (
            <Draggable key={c.id} draggableId={c.id} index={i}>
              {p => (
                <CardBox
                  ref={p.innerRef}
                  {...p.dragHandleProps}
                  {...p.draggableProps}
                  text={c.text}
                  icon={c.icon}
                />
              )}
            </Draggable>
          ))}
          {prov.placeholder}
        </div>
      )}
    </Droppable>

    {/* Deck in the middle */}
    <Droppable droppableId="central">
      {prov => (
        <div
          ref={prov.innerRef}
          {...prov.droppableProps}
          className={`${styles.zone} ${widthClass} ${getBorderClass('central')}`}
        >
          <h3
            className={styles.zoneTitle}
            style={{ backgroundColor: '#e6e6e6' }}
          >
            Deck
          </h3>
          {columns.central.map((c, i) => (
            <Draggable key={c.id} draggableId={c.id} index={i}>
              {p => (
                <CardBox
                  ref={p.innerRef}
                  {...p.dragHandleProps}
                  {...p.draggableProps}
                  text={c.text}
                  icon={c.icon}
                />
              )}
            </Draggable>
          ))}
          {prov.placeholder}
        </div>
      )}
    </Droppable>

    {/* Do Not Pass on the right */}
    <Droppable droppableId="doNotPass">
      {prov => (
        <div
          ref={prov.innerRef}
          {...prov.droppableProps}
          className={`${styles.zone} ${widthClass} ${getBorderClass('doNotPass')}`}
          style={{
            // light pink when 1/1 picked
            backgroundColor:
              columns.doNotPass.length === 1 ? '#fdb3c5' : undefined, 
          }}
        >
          <h3
            className={styles.zoneTitle}
            style={{ backgroundColor: '#f84b74' }}
          >
            Do Not Pass{' '}
            <span className={styles.counter}>
              {columns.doNotPass.length}/1
            </span>
          </h3>
          {columns.doNotPass.map((c, i) => (
            <Draggable key={c.id} draggableId={c.id} index={i}>
              {p => (
                <CardBox
                  ref={p.innerRef}
                  {...p.dragHandleProps}
                  {...p.draggableProps}
                  text={c.text}
                  icon={c.icon}
                />
              )}
            </Draggable>
          ))}
          {prov.placeholder}
        </div>
      )}
    </Droppable>
  </>
)}

{/* TOP THREE */}
{phase === TOP_PHASE && (
  <>
    {/* Passed Cards Pool (neutral) */}
    <Droppable droppableId="central">
      {prov => (
        <div
          ref={prov.innerRef}
          {...prov.droppableProps}
          className={`${styles.zone} ${widthClass} ${getBorderClass('central')}`}
          style={{ borderColor: '#35d0ba' }}
        >
          <h3
            className={styles.zoneTitle}
            style={{ backgroundColor: '#35d0ba' }}
          >
            Your Passed Cards
          </h3>
          <div className={styles.cardsGrid}>
            {columns.central.map((c, i) => (
              <Draggable key={c.id} draggableId={c.id} index={i}>
                {p => (
                  <CardBox
                    ref={p.innerRef}
                    {...p.dragHandleProps}
                    {...p.draggableProps}
                    text={c.text}
                    icon={c.icon}
                  />
                )}
              </Draggable>
            ))}
            {prov.placeholder}
          </div>
        </div>
      )}
    </Droppable>

    {/* Top Three Pool (light orange tint when full) */}
    <Droppable droppableId="pass">
      {prov => (
        <div
          ref={prov.innerRef}
          {...prov.droppableProps}
          className={`${styles.zone} ${widthClass} ${getBorderClass('pass')}`}
          style={{
            backgroundColor:
              columns.pass.length === 3 ? '#ffd6b2' : undefined,
          }}
        >
          <div
            className={styles.zoneTitle}
            style={{ backgroundColor: '#ff9234' }}
          >
            Top Three Pool{' '}
            <span className={styles.counter}>
              {columns.pass.length}/3
            </span>
          </div>
          {columns.pass.map((c, i) => (
            <Draggable key={c.id} draggableId={c.id} index={i}>
              {p => (
                <CardBox
                  ref={p.innerRef}
                  {...p.dragHandleProps}
                  {...p.draggableProps}
                  text={c.text}
                  icon={c.icon}
                />
              )}
            </Draggable>
          ))}
          {prov.placeholder}
        </div>
      )}
    </Droppable>
  </>
)}

{/* BOTTOM THREE */}
{phase === BOTTOM_PHASE && (
  <>
    {/* Rejected Cards Pool (neutral) */}
    <Droppable droppableId="central">
      {prov => (
        <div
          ref={prov.innerRef}
          {...prov.droppableProps}
          className={`${styles.zone} ${widthClass} ${getBorderClass('central')}`}
          style={{ borderColor: '#f84b74' }}
        >
          <h3
            className={styles.zoneTitle}
            style={{ backgroundColor: '#f84b74' }}
          >
            Your Rejected Cards
          </h3>
          <div className={styles.cardsGrid}>
            {columns.central.map((c, i) => (
              <Draggable key={c.id} draggableId={c.id} index={i}>
                {p => (
                  <CardBox
                    ref={p.innerRef}
                    {...p.dragHandleProps}
                    {...p.draggableProps}
                    text={c.text}
                    icon={c.icon}
                  />
                )}
              </Draggable>
            ))}
            {prov.placeholder}
          </div>
        </div>
      )}
    </Droppable>

    {/* Bottom Three Pool (light orange tint when full) */}
    <Droppable droppableId="doNotPass">
      {prov => (
        <div
          ref={prov.innerRef}
          {...prov.droppableProps}
          className={`${styles.zone} ${widthClass} ${getBorderClass('doNotPass')}`}
          style={{
            backgroundColor:
              columns.doNotPass.length === 3 ? '#ffd6b2' : undefined,
          }}
        >
          <div
            className={styles.zoneTitle}
            style={{ backgroundColor: '#ff9234' }}
          >
            Bottom Three Pool{' '}
            <span className={styles.counter}>
              {columns.doNotPass.length}/3
            </span>
          </div>
          {columns.doNotPass.map((c, i) => (
            <Draggable key={c.id} draggableId={c.id} index={i}>
              {p => (
                <CardBox
                  ref={p.innerRef}
                  {...p.dragHandleProps}
                  {...p.draggableProps}
                  text={c.text}
                  icon={c.icon}
                />
              )}
            </Draggable>
          ))}
          {prov.placeholder}
        </div>
      )}
    </Droppable>
  </>
)}


{/* POLICY PHASES */}
{(phase === POLICY1_PHASE || phase === POLICY2_PHASE) && (
  <>
    {/* Top Three Pool (green on full) */}
    <Droppable droppableId="pass">
      {prov => (
        <div
          ref={prov.innerRef}
          {...prov.droppableProps}
          className={`${styles.zone} ${widthClass} ${getBorderClass('pass')}`}
          /* style={{
            backgroundColor:
              policyPassCount === (phase === POLICY1_PHASE ? 2 : 1)
                ? '#adf6ec'
                : undefined,
          }}*/
        >
          <div className={styles.zoneTitle} style={{ backgroundColor: '#35d0ba' }}>
            Top Three Pool{' '}
            <span className={styles.counter}>
              {policyPassCount}/{phase === POLICY1_PHASE ? 2 : 1}
            </span>
          </div>
          {columns.pass.map((c, i) => (
            <Draggable key={c.id} draggableId={c.id} index={i}>
              {p => (
                <CardBox
                  ref={p.innerRef}
                  {...p.dragHandleProps}
                  {...p.draggableProps}
                  text={c.text}
                  icon={c.icon}
                />
              )}
            </Draggable>
          ))}
          {prov.placeholder}
        </div>
      )}
    </Droppable>

    {/* Policy Slot */}
<Droppable droppableId="doNotPass">
  {prov => (
    <div
      ref={prov.innerRef}
      {...prov.droppableProps}
      className={`${styles.zone} ${widthClass} ${getBorderClass('doNotPass')}`}
      style={{
        /* when 3 cards are in the slot, tint it */
        backgroundColor:
          columns.doNotPass.length === 3
            ? '#ffeb99'    // your chosen “full” color
            : undefined
      }}
    >
      <h3 className={styles.zoneTitle} style={{ backgroundColor: '#ffcd3c' }}>
        {phase === POLICY1_PHASE ? 'Policy 1' : 'Policy 2'}
      </h3>

      {columns.doNotPass.map((c, i) => (
        <Draggable key={c.id} draggableId={c.id} index={i}>
          {p => (
            <CardBox
              ref={p.innerRef}
              {...p.dragHandleProps}
              {...p.draggableProps}
              text={c.text}
              icon={c.icon}
            />
          )}
        </Draggable>
      ))}

      {prov.placeholder}
    </div>
  )}
</Droppable>

    {/* Bottom Three Pool */}
    <Droppable droppableId="central">
      {prov => (
        <div
          ref={prov.innerRef}
          {...prov.droppableProps}
          className={`${styles.zone} ${widthClass} ${getBorderClass('central')}`}
          /* style={{
            backgroundColor:
              policyCentralCount === (phase === POLICY1_PHASE ? 1 : 2)
                ? '#fdb3c5'
                : undefined,
          }} */
        >
          <div className={styles.zoneTitle} style={{ backgroundColor: '#f84b74' }}>
            Bottom Three Pool{' '}
            <span className={styles.counter}>
              {policyCentralCount}/{phase === POLICY1_PHASE ? 1 : 2}
            </span>
          </div>
          {columns.central.map((c, i) => (
            <Draggable key={c.id} draggableId={c.id} index={i}>
              {p => (
                <CardBox
                  ref={p.innerRef}
                  {...p.dragHandleProps}
                  {...p.draggableProps}
                  text={c.text}
                  icon={c.icon}
                />
              )}
            </Draggable>
          ))}
          {prov.placeholder}
        </div>
      )}
    </Droppable>
  </>
)}

{/* RANKING PHASE */}
{phase === RANK_PHASE && (
  <div className={styles.rankPhaseContainer}>

    {/* Policy One */}
    <div
      className={`${styles.zone} ${styles.rankContainer}`}
      onClick={() => handleRankClick('policyOne')}
    >
      <h3 className={styles.zoneTitle}>
        Policy One
        {rankPhaseRanks.policyOne && (
          <span className={styles.rankCircle}>
            {rankPhaseRanks.policyOne}
          </span>
        )}
      </h3>
      <div className={styles.cardsGrid}>
        {policyOne.map(c => (
          <CardBox key={c.id} text={c.text} icon={c.icon} />
        ))}
      </div>
    </div>

    {/* Policy Two */}
    <div
      className={`${styles.zone} ${styles.rankContainer}`}
      onClick={() => handleRankClick('policyTwo')}
    >
      <h3 className={styles.zoneTitle}>
        Policy Two
        {rankPhaseRanks.policyTwo && (
          <span className={styles.rankCircle}>
            {rankPhaseRanks.policyTwo}
          </span>
        )}
      </h3>
      <div className={styles.cardsGrid}>
        {policyTwo.map(c => (
          <CardBox key={c.id} text={c.text} icon={c.icon} />
        ))}
      </div>
    </div>

    {/* No Policy */}
    <div
      className={`${styles.zone} ${styles.rankContainer}`}
      onClick={() => handleRankClick('noPolicy')}
    >
      <h3 className={styles.zoneTitle}>
        No Policy
        {rankPhaseRanks.noPolicy && (
          <span className={styles.rankCircle}>
            {rankPhaseRanks.noPolicy}
          </span>
        )}
      </h3>
    </div>

  </div>
)}

        </div>
      </DragDropContext>

      <button
        onClick={handleNext}
        disabled={!isReady}
        className={styles.buttonZoneStyle}
      >
        {buttonLabel}
      </button>

      {/* Exit Button */}
      <button
        onClick={() => navigate('/about')}
        className={styles.buttonZoneStyle}
        style={{
          position: 'fixed',
          bottom:   '30px',
          left:     '30px',
          margin:   0,
          zIndex:   1000,
        }}
      >
        Exit Game
      </button>

    </div>
  </>                                   
);
}