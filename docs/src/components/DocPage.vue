<template lang="pug">
q-page.doc-page

  .text-right.text-bold
    q-icon.text-negative.q-mx-sm(:name="mdiFire")
    | Looking for
    doc-link.q-mx-xs(to="https://next.quasar.dev/start/upgrade-guide") Quasar v2 beta
    | (Vue 3) docs?
    q-icon.text-negative.q-mx-xs(:name="mdiFire")

  h1.doc-heading.doc-h1#introduction(v-if="title" @click="copyHeading('introduction')")
    span {{ title }}
    q-badge.q-ml-sm.doc-page__badge(v-if="badge") {{ badge }}
    a.doc-page__top-link.float-right(v-if="noEdit === false", :href="editHref", target="_blank", rel="noopener noreferrer")
      q-icon(:name="mdiPencil", @click.stop)
        q-tooltip Improve page

  slot

  .doc-page-nav.text-primary.q-pb-lg(v-if="related !== void 0")
    .text-h6.q-pb-md Related
    .q-gutter-md.flex
      router-link.q-link.doc-page-related.rounded-borders.q-pa-md.cursor-pointer.column.justify-center.bg-grey-4(
        v-for="link in related"
        :key="link.category + link.path"
        :to="link.path"
      )
        .row.no-wrap.items-center
          .col
            .doc-page-nav__categ.text-uppercase {{ link.category || 'Docs' }}
            .doc-page-nav__name.text-weight-bold {{ link.name }}

          q-icon.q-ml-lg(:name="mdiLaunch")

  .doc-page-nav.text-primary.q-pb-xl(v-if="nav !== void 0")
    .text-h6.q-pb-md Ready for more?
    .q-gutter-md.flex
      router-link.q-link.doc-page-related.doc-page-related-bordered.rounded-borders.q-pa-md.cursor-pointer.column.justify-center.bg-white(
        v-for="link in nav"
        :key="link.category + link.path"
        :to="link.path"
      )
        .row.no-wrap.items-center
          q-icon(
            :name="link.dir === 'left' ? mdiChevronLeft : mdiChevronRight"
            v-if="link.dir !== void 0"
            :class="link.dir === 'right' ? 'order-last q-ml-md' : 'order-first q-mr-md'"
          )

          .col
            .doc-page-nav__categ.text-uppercase {{ link.category || 'Docs' }}
            .doc-page-nav__name.text-weight-bold {{ link.name }}

  .doc-page-footer
    q-separator.q-mb-sm

    .q-mb-md(v-if="noEdit === false")
      | Caught a mistake? <doc-link :to="editHref">Suggest an edit on GitHub</doc-link>

    .doc-page-footer__icons.row.items-center.q-gutter-sm
      a(href="https://github.quasar.dev", target="_blank", rel="noopener")
        q-icon(:name="fabGithub")

      a(href="https://blog.quasar.dev", target="_blank", rel="noopener")
        q-icon(:name="mdiBlogger")

      a(href="https://chat.quasar.dev", rel="noopener", target="_blank")
        q-icon(:name="mdiChat")

      a(href="https://forum.quasar.dev/", rel="noopener", target="_blank")
        q-icon(:name="mdiForum")

      a(href="https://twitter.quasar.dev", target="_blank", rel="noopener")
        q-icon(:name="fabTwitter")

      a(href="https://facebook.quasar.dev", target="_blank", rel="noopener")
        q-icon(:name="fabFacebook")

      a(href="https://donate.quasar.dev", rel="sponsored", target="_blank")
        q-icon(:name="mdiCharity")

    div.q-mt-md
      | <doc-link to="https://github.com/quasarframework/quasar/blob/dev/LICENSE">MIT LICENSE</doc-link> | <doc-link to="https://www.iubenda.com/privacy-policy/40685560">Privacy Policy</doc-link> | <doc-link to="https://github.com/quasarframework/quasar-art">Quasar Artwork</doc-link>

    div Copyright © 2015 - {{ year }} PULSARDEV SRL, Razvan Stoenescu
</template>

<script>
import {
  fabGithub, fabTwitter, fabFacebook
} from '@quasar/extras/fontawesome-v5'

import {
  mdiBlogger, mdiForum, mdiChat, mdiCharity,
  mdiPencil, mdiLaunch,
  mdiChevronLeft, mdiChevronRight, mdiFire
} from '@quasar/extras/mdi-v5'

import { copyHeading } from 'assets/page-utils'

const year = (new Date()).getFullYear()

export default {
  name: 'DocPage',

  created () {
    this.fabGithub = fabGithub
    this.fabTwitter = fabTwitter
    this.fabFacebook = fabFacebook

    this.mdiBlogger = mdiBlogger
    this.mdiForum = mdiForum
    this.mdiChat = mdiChat
    this.mdiCharity = mdiCharity
    this.mdiPencil = mdiPencil
    this.mdiLaunch = mdiLaunch
    this.mdiChevronLeft = mdiChevronLeft
    this.mdiChevronRight = mdiChevronRight
    this.mdiFire = mdiFire
  },

  props: {
    title: String,
    related: Array,
    nav: Array,
    noEdit: Boolean,
    badge: String
  },

  data () {
    return {
      year
    }
  },

  computed: {
    editHref () {
      return `https://github.com/quasarframework/quasar/edit/dev/docs/src/pages${this.$route.path}.md`
    }
  },

  methods: {
    copyHeading
  }
}
</script>

<style lang="sass">
.doc-page
  padding: 16px 46px
  font-weight: 300
  max-width: 900px
  margin-left: auto
  margin-right: auto

  > div, > pre
    margin-bottom: 22px

  &__top-link
    color: inherit
    text-decoration: none
    outline: 0

  &__badge
    vertical-align: super

@media (max-width: 600px)
  .doc-page
    padding: 16px

.doc-page-related
  color: $grey-9
  transition: color .28s
  border: 1px solid rgba(0,0,0,.1)

  &:hover
    color: $primary

.doc-page-related-bordered
  border: 1px solid $separator-color

.doc-page-footer
  font-size: 12px
  padding: 36px 0 16px

  &__icons
    font-size: 28px

    a
      text-decoration: none
      outline: 0
      color: $primary
      transition: color .28s

      &:hover
        color: $grey-8

.doc-page-nav
  margin: 68px 0 0
  margin-bottom: 0 !important

  .q-link
    position: relative
    &:before
      content: ''
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      background: #000
      opacity: 0
      transition: opacity .28s
    &:focus:before
      opacity: .1

  & + &
    margin-top: 0

  .q-icon
    font-size: 1.75em

  &__categ
    font-size: .8em

  &__name
    font-size: 1em
</style>
