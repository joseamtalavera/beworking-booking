import Box from '@mui/material/Box';

// Professional floor-plan renderer: a walled room with oriented desk + chair +
// person shapes, occupant labels, and amenities. Ported from the standalone
// design. Two layouts: 16 = original U-shape; 14 = MA1A5 (two facing walls of 7).

// Per-orientation geometry within a 72×66 desk cell.
const GEO = {
  up:   { desk:{l:6,t:0,w:60,h:28},  laptop:{l:21,t:21,w:30,h:6}, chair:{l:21,t:44,w:30,h:20,br:'9px 9px 12px 12px'},  shoulders:{l:19,t:42,w:34,h:18}, head:{l:28,t:27,w:16,h:16}, num:{l:6,t:5,w:60} },
  down: { desk:{l:6,t:38,w:60,h:28}, laptop:{l:21,t:39,w:30,h:6}, chair:{l:21,t:2,w:30,h:20,br:'12px 12px 9px 9px'},  shoulders:{l:19,t:6,w:34,h:18},  head:{l:28,t:23,w:16,h:16}, num:{l:6,t:44,w:60} },
  left: { desk:{l:0,t:6,w:28,h:54},  laptop:{l:22,t:24,w:5,h:18}, chair:{l:44,t:22,w:20,h:32,br:'10px 12px 12px 10px'}, shoulders:{l:43,t:17,w:16,h:32}, head:{l:29,t:25,w:16,h:16}, num:{l:0,t:26,w:28} },
  right:{ desk:{l:44,t:6,w:28,h:54}, laptop:{l:45,t:24,w:5,h:18}, chair:{l:8,t:22,w:20,h:32,br:'12px 10px 10px 12px'},  shoulders:{l:13,t:17,w:16,h:32}, head:{l:27,t:25,w:16,h:16}, num:{l:44,t:26,w:28} },
};

const ROOM_LAYOUTS = {
  16: {
    w: 354, h: 770,
    desks: [
      { id:10,x:8,t:36,f:'left' },  { id:9,x:8,t:152,f:'left' },  { id:8,x:8,t:268,f:'left' },
      { id:7,x:8,t:384,f:'left' },  { id:6,x:8,t:500,f:'left' },  { id:5,x:8,t:616,f:'left' },
      { id:16,x:260,t:36,f:'right' },{ id:15,x:260,t:152,f:'right' },{ id:4,x:260,t:268,f:'right' },
      { id:3,x:260,t:384,f:'right' },{ id:2,x:260,t:500,f:'right' }, { id:1,x:260,t:616,f:'right' },
      { id:12,x:96,t:66,f:'down' }, { id:14,x:176,t:66,f:'down' },
      { id:11,x:96,t:132,f:'up' },  { id:13,x:176,t:132,f:'up' },
    ],
    variant: 'u-shape',
  },
  14: {
    // MA1A5: two facing walls of 7 desks down a central aisle.
    w: 354, h: 856,
    desks: [
      { id:1,x:8,t:36,f:'left' },  { id:2,x:8,t:152,f:'left' },  { id:3,x:8,t:268,f:'left' },
      { id:4,x:8,t:384,f:'left' },  { id:5,x:8,t:500,f:'left' },  { id:6,x:8,t:616,f:'left' },
      { id:7,x:8,t:732,f:'left' },
      { id:8,x:260,t:36,f:'right' },  { id:9,x:260,t:152,f:'right' },  { id:10,x:260,t:268,f:'right' },
      { id:11,x:260,t:384,f:'right' }, { id:12,x:260,t:500,f:'right' }, { id:13,x:260,t:616,f:'right' },
      { id:14,x:260,t:732,f:'right' },
    ],
    variant: 'aisle',
  },
};

function colorsFor(state) {
  if (state === 'selected') return { desk:'#159028',db:'#0e7a1f',chair:'#0e7a1f',laptop:'#0a5816',sh:'#fff',head:'#fff',num:'#fff',occ:true,shadow:'0 5px 13px rgba(20,144,40,.4)',label:'#1f8a2c' };
  if (state === 'reserved') return { desk:'#e7e5df',db:'#cfccc3',chair:'#d6d3ca',laptop:'#b7b3a9',sh:'#b6b2a8',head:'#c6c2b8',num:'#a09c92',occ:true,shadow:'0 1px 2px rgba(0,0,0,.06)',label:'#a09c92' };
  return { desk:'#fff',db:'#1f9d2e',chair:'#e6e4dd',laptop:'transparent',sh:'#e6e4dd',head:'#e6e4dd',num:'#1f9d2e',occ:false,shadow:'0 1px 3px rgba(0,0,0,.10)',label:'#4fa063' };
}

const abs = (g, extra) => ({ position: 'absolute', left: g.l, top: g.t, width: g.w, height: g.h, ...extra });

function DeskCell({ d, state, label, onClick }) {
  const c = colorsFor(state);
  const g = GEO[d.f];
  return (
    <Box
      onClick={state === 'reserved' ? undefined : onClick}
      sx={{
        position: 'absolute', left: d.x, top: d.t, width: 72, height: 66,
        cursor: state === 'reserved' ? 'not-allowed' : 'pointer',
        transition: 'transform .12s ease',
        transform: state === 'selected' ? 'scale(1.06)' : 'none',
        zIndex: state === 'selected' ? 5 : 1,
      }}
    >
      <Box sx={abs(g.chair, { borderRadius: g.chair.br, background: c.chair })} />
      {c.occ && (
        <>
          <Box sx={abs(g.shoulders, { borderRadius: '999px', background: c.sh })} />
          <Box sx={abs(g.head, { borderRadius: '50%', background: c.head })} />
        </>
      )}
      <Box sx={abs(g.desk, { borderRadius: '6px', background: c.desk, border: `1.6px solid ${c.db}`, boxShadow: c.shadow })} />
      {c.occ && <Box sx={abs(g.laptop, { borderRadius: '3px', background: c.laptop })} />}
      <Box component="span" sx={{ position: 'absolute', left: g.num.l, top: g.num.t, width: g.num.w, textAlign: 'center', fontSize: '12px', fontWeight: 700, color: c.num, lineHeight: '16px', pointerEvents: 'none' }}>
        {d.id}
      </Box>
      <Box component="span" sx={{ position: 'absolute', left: -6, top: 67, width: 84, textAlign: 'center', fontSize: '8.5px', fontWeight: 600, color: c.label, lineHeight: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', pointerEvents: 'none' }}>
        {label}
      </Box>
    </Box>
  );
}

function Amenities({ layout, isEs }) {
  return (
    <>
      {/* windows along the top wall */}
      <Box sx={{ position: 'absolute', left: 50, top: -7, width: 60, height: 7, background: '#aacbe0' }} />
      <Box sx={{ position: 'absolute', left: 150, top: -7, width: 60, height: 7, background: '#aacbe0' }} />
      <Box sx={{ position: 'absolute', left: 250, top: -7, width: 60, height: 7, background: '#aacbe0' }} />
      {/* entrance gap on the bottom wall */}
      <Box sx={{ position: 'absolute', left: 146, bottom: -7, width: 62, height: 7, background: '#efece6' }} />
      <Box sx={{ position: 'absolute', left: 117, bottom: -26, width: 120, textAlign: 'center', fontSize: '10px', fontWeight: 500, color: '#8f8b81' }}>
        {isEs ? 'Entrada / Entrance' : 'Entrance'}
      </Box>
      {layout.variant === 'u-shape' && (
        <>
          {/* central common zone */}
          <Box sx={{ position: 'absolute', left: 124, top: 332, width: 108, height: 108, background: '#ece7dc', border: '1px dashed #d4cec1', borderRadius: '12px' }} />
          <Box sx={{ position: 'absolute', left: 150, top: 358, width: 56, height: 56, borderRadius: '50%', background: '#e0dacd', border: '1px solid #cfc9bc' }} />
          <Box sx={{ position: 'absolute', left: 124, top: 444, width: 108, textAlign: 'center', fontSize: '10px', fontWeight: 500, color: '#9a968c' }}>
            {isEs ? 'Zona común / Common' : 'Common area'}
          </Box>
          <Box sx={{ position: 'absolute', left: 120, top: 286, width: 20, height: 20, borderRadius: '50%', background: '#4f8159', border: '2px solid #3c6645' }} />
          <Box sx={{ position: 'absolute', left: 218, top: 286, width: 20, height: 20, borderRadius: '50%', background: '#4f8159', border: '2px solid #3c6645' }} />
          <Box sx={{ position: 'absolute', left: 160, top: 560, width: 34, height: 34, borderRadius: '50%', background: '#4f8159', border: '2px solid #3c6645' }} />
        </>
      )}
      {layout.variant === 'aisle' && (
        <>
          {/* plants flanking the central aisle */}
          <Box sx={{ position: 'absolute', left: 167, top: 300, width: 20, height: 20, borderRadius: '50%', background: '#4f8159', border: '2px solid #3c6645' }} />
          <Box sx={{ position: 'absolute', left: 167, top: 540, width: 20, height: 20, borderRadius: '50%', background: '#4f8159', border: '2px solid #3c6645' }} />
        </>
      )}
    </>
  );
}

export default function CoworkingRoomPlan({ deskCount = 16, bookedDesks, selectedDesk, onSelect, names, isEs = true }) {
  const layout = ROOM_LAYOUTS[deskCount] || ROOM_LAYOUTS[16];
  const desks = layout.desks.filter((d) => d.id <= deskCount);
  const stateOf = (id) => (selectedDesk === id ? 'selected' : (bookedDesks?.has(id) ? 'reserved' : 'available'));
  const labelOf = (id, st) => {
    if (st === 'available') return isEs ? 'Libre' : 'Free';
    if (st === 'selected') return isEs ? 'Tú' : 'You';
    return (names && names[id]) || (isEs ? 'Ocupada' : 'Occupied');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', py: 1 }}>
      <Box
        sx={{
          position: 'relative', width: layout.w, height: layout.h, flex: 'none',
          border: '7px solid #2b2b2b', borderRadius: '5px', background: '#efece6',
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,0,0,.028) 39px,rgba(0,0,0,.028) 40px),'
            + 'repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,0,0,.028) 39px,rgba(0,0,0,.028) 40px)',
          boxShadow: '0 8px 24px rgba(0,0,0,.10)',
        }}
      >
        <Amenities layout={layout} isEs={isEs} />
        {desks.map((d) => {
          const st = stateOf(d.id);
          return <DeskCell key={d.id} d={d} state={st} label={labelOf(d.id, st)} onClick={() => onSelect(d.id)} />;
        })}
      </Box>
    </Box>
  );
}
