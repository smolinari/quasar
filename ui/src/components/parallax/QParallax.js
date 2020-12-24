import { h, defineComponent, ref, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'

import { height, offset } from '../../utils/dom.js'
import frameDebounce from '../../utils/frame-debounce.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { hSlot } from '../../utils/render.js'
import { listenOpts } from '../../utils/event.js'

const { passive } = listenOpts

export default defineComponent({
  name: 'QParallax',

  props: {
    src: String,
    height: {
      type: Number,
      default: 500
    },
    speed: {
      type: Number,
      default: 1,
      validator: v => v >= 0 && v <= 1
    },

    scrollTarget: {
      default: void 0
    }
  },

  emits: ['scroll'],

  setup (props, { slots, emit }) {
    const vm = getCurrentInstance()

    const percentScrolled = ref(0)
    const rootRef = ref(null)
    const mediaParentRef = ref(null)
    const mediaRef = ref(null)

    let isWorking, mediaEl, mediaHeight, resizeHandler, observer, localScrollTarget

    watch(() => props.height, () => {
      isWorking === true && updatePos()
    })

    watch(() => props.scrollTarget, () => {
      if (isWorking === true) {
        stop()
        start()
      }
    })

    let update = percentage => {
      percentScrolled.value = percentage
      vm.vnode.props.onScroll === true && emit('scroll', percentage)
    }

    function updatePos () {
      let containerTop, containerHeight, containerBottom

      if (localScrollTarget === window) {
        containerTop = 0
        containerHeight = window.innerHeight
        containerBottom = containerHeight
      }
      else {
        containerTop = offset(localScrollTarget).top
        containerHeight = height(localScrollTarget)
        containerBottom = containerTop + containerHeight
      }

      const top = offset(rootRef.value).top
      const bottom = top + props.height

      if (observer !== void 0 || (bottom > containerTop && top < containerBottom)) {
        const percent = (containerBottom - top) / (props.height + containerHeight)
        setPos((mediaHeight - props.height) * percent * props.speed)
        update(percent)
      }
    }

    let setPos = offset => {
      // apply it immediately without any delay
      mediaEl.style.transform = `translate3D(-50%,${ Math.round(offset) }px, 0)`
    }

    function onResize () {
      mediaHeight = mediaEl.naturalHeight || mediaEl.videoHeight || height(mediaEl)
      isWorking === true && updatePos()
    }

    function start () {
      isWorking = true
      localScrollTarget = getScrollTarget(rootRef.value, props.scrollTarget)
      localScrollTarget.addEventListener('scroll', updatePos, passive)
      window.addEventListener('resize', resizeHandler, passive)
      updatePos()
    }

    function stop () {
      if (isWorking === true) {
        isWorking = false
        localScrollTarget.removeEventListener('scroll', updatePos, passive)
        window.removeEventListener('resize', resizeHandler, passive)
        localScrollTarget = void 0
      }
    }

    onMounted(() => {
      setPos = frameDebounce(setPos)
      update = frameDebounce(update)
      resizeHandler = frameDebounce(onResize)

      mediaEl = slots.media !== void 0
        ? mediaParentRef.value.children[ 0 ]
        : mediaRef.value

      mediaEl.onload = mediaEl.onloadstart = mediaEl.loadedmetadata = onResize
      onResize()
      mediaEl.style.display = 'initial'

      if (window.IntersectionObserver !== void 0) {
        observer = new IntersectionObserver(entries => {
          const fn = entries[ 0 ].isIntersecting === true ? start : stop
          fn()
        })

        observer.observe(rootRef.value)
      }
      else {
        start()
      }
    })

    onBeforeUnmount(() => {
      stop()
      observer !== void 0 && observer.disconnect()
      mediaEl.onload = mediaEl.onloadstart = mediaEl.loadedmetadata = null
    })

    return () => {
      return h('div', {
        ref: rootRef,
        class: 'q-parallax',
        style: { height: `${ props.height }px` }
      }, [
        h('div', {
          ref: mediaParentRef,
          class: 'q-parallax__media absolute-full'
        }, slots.media !== void 0 ? slots.media() : [
          h('img', {
            ref: mediaRef,
            src: props.src
          })
        ]),

        h(
          'div',
          { class: 'q-parallax__content absolute-full column flex-center' },
          slots.content !== void 0
            ? slots.content({ percentScrolled: percentScrolled.value })
            : hSlot(slots.default)
        )
      ])
    }
  }
})
