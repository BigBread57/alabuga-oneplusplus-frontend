import { useEffect } from 'react'

function Metrika() {
  useEffect(() => {
    const script = document.createElement('script')
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
       m[i].l=1*new Date();
       for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
       k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
       (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      
       ym(97581969, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true
       });
    `

    document.head.appendChild(script)

    const noscript = document.createElement('noscript')
    noscript.innerHTML = `
      <div>
        <img src="https://mc.yandex.ru/watch/97581969" style="position:absolute; left:-9999px;" alt="" />
      </div>
    `

    document.body.appendChild(noscript)

    return () => {
      document.head.removeChild(script)
      document.body.removeChild(noscript)
    }
  }, [])

  return null
}

export default Metrika
