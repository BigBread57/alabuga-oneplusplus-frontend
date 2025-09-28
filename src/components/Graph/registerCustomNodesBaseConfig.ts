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
      refY: 15,
      fill: '#fff',
      fontFamily: 'Arial, sans-serif',
      fontSize: 14,
      fontWeight: 'bold',
      textAnchor: 'start',
      // Настройки переноса текста
      textWrap: {
        width: -55, // отрицательное значение = ширина узла минус отступ
        height: 25, // максимальная высота для заголовка
        ellipsis: true, // добавляет ... если текст не помещается
        breakWord: false, // не разрывать слова посередине
      },
    },
    'description': {
      refX: 45,
      refY: 45,
      fill: '#fff',
      fontFamily: 'Arial, sans-serif',
      fontSize: 11,
      textAnchor: 'start',
      fillOpacity: 0.8,
      // Настройки переноса для описания
      textWrap: {
        width: -55,
        height: 25,
        ellipsis: true,
        breakWord: false,
      },
    },
  },
}
