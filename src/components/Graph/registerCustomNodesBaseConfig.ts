export const baseNodeConfig = {
  width: 250,
  height: 80,
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'circle',
      selector: 'icon-bg',
    },
    {
      tagName: 'text',
      selector: 'icon',
    },
    {
      tagName: 'text',
      selector: 'title',
    },
    {
      tagName: 'text',
      selector: 'description',
    },
  ],
  attrs: {
    'body': {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 2,
      rx: 8,
      ry: 8,
      pointerEvents: 'visiblePainted',
    },
    'icon-bg': {
      cx: 20,
      cy: 20,
      r: 16,
      fill: '#fff',
      fillOpacity: 0.9,
    },
    'icon': {
      refX: 20,
      refY: 8,
      fill: '#333',
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      textAnchor: 'middle',
      dominantBaseline: 'central',
    },
    'title': {
      refX: 45,
      refY: 20,
      fill: '#fff',
      fontFamily: 'Arial, sans-serif',
      fontSize: 14,
      fontWeight: 'bold',
      textAnchor: 'start',
    },
    'description': {
      refX: 45,
      refY: 40,
      fill: '#fff',
      fontFamily: 'Arial, sans-serif',
      fontSize: 11,
      textAnchor: 'start',
      fillOpacity: 0.8,
    },
  },
}
