import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MajorOps',
  description: 'Major incident management built on emergency-service discipline. ICS-based methodology for IT operations.',
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Philosophy', link: '/why/philosophy' },
      { text: 'Glossary', link: '/reference/glossary' },
      { text: 'GitHub', link: 'https://github.com/itsjustrdm/majorops' },
    ],

    sidebar: [
      {
        text: 'Why MajorOps',
        items: [
          { text: 'Philosophy', link: '/why/philosophy' },
        ],
      },
      {
        text: 'Command Model',
        items: [
          { text: 'IT Incident Command (ICS)', link: '/command-model/ics-structure' },
          { text: 'Command Roles', link: '/command-model/command-roles' },
          { text: 'Alarm Levels', link: '/command-model/alarm-levels' },
          { text: 'Incident Lifecycle', link: '/command-model/incident-lifecycle' },
        ],
      },
      {
        text: 'Bridge Operations',
        items: [
          { text: 'Bridge Control', link: '/bridge/bridge-control' },
          { text: 'Escalation Doctrine', link: '/bridge/escalation' },
        ],
      },
      {
        text: 'Run Cards',
        items: [
          { text: 'Three-Tier System', link: '/runcards/runcard-system' },
        ],
      },
      {
        text: 'Governance',
        items: [
          { text: 'After Action', link: '/governance/after-action' },
          { text: 'Peer Review', link: '/governance/peer-review' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Glossary', link: '/reference/glossary' },
          { text: 'Personas', link: '/reference/personas' },
          { text: 'Exposure Notation', link: '/reference/exposure-notation' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/itsjustrdm/majorops' },
    ],

    footer: {
      message: 'Major incident management built on emergency-service discipline.',
      copyright: 'MajorOps — itsjustrdm',
    },

    search: {
      provider: 'local',
    },
  },
})
