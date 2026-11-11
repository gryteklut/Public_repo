export const UDEMY_COURSE_URL =
  'https://www.udemy.com/course/ms100course/learn/'

export const UDEMY_COURSE_TITLE =
  'AB-650 & MS-102 Hands on Certification Course with Sims'

export type UdemyPriority = 'watch' | 'skim' | 'skip'

export type UdemySectionHint = {
  section: string
  priority: UdemyPriority
  /** Specific lecture titles to prioritize inside the section */
  lectures?: string[]
  note?: string
}

export type UdemyWatchGuide = {
  tip?: string
  sections: UdemySectionHint[]
}

/** Mapped to John Christopher's Udemy course (ms100course), updated for AB-650 + MS-102. */
export const udemyByModuleId: Record<string, UdemyWatchGuide> = {
  'd1-tenant': {
    tip: 'Start with the short AB-650 vs MS-102 intro once, then the tenant section. AI license + Backup lectures are high value for AB-650.',
    sections: [
      {
        section: 'Introduction',
        priority: 'watch',
        lectures: ['AB-650 and MS-102 material differences'],
        note: 'Watch this once at the start of the 10-day plan.',
      },
      {
        section: 'Configure and manage a Microsoft 365 tenant',
        priority: 'watch',
        lectures: [
          'Configure branding in a Microsoft 365 tenant, logo, URL, themes and backgrounds',
          'Implement and manage domains',
          'Configure & manage organizational settings, security & privacy & org profile',
          'Manage and monitor Microsoft 365 licenses, including group-based licensing',
          'Understanding the capabilities of Copilot and Agents in Microsoft 365',
          'Manage and monitor licenses for AI services, including Microsoft 365 Copilot',
          'Configure and use Microsoft 365 Backup, including setup, restore, etc',
          'Configure and review network connectivity insights',
          'Monitor the health of Microsoft 365 services by using Service health',
        ],
      },
      {
        section: '(OPTIONAL) Setting Up a Practice Lab',
        priority: 'skip',
        note: 'Skip unless you still need a lab tenant. You already have an E5 dev tenant.',
      },
    ],
  },

  'd2-workloads': {
    tip: 'This is an AB-650-labelled section in Udemy — prioritize Teams Copilot/transcription and SharePoint Advanced Management.',
    sections: [
      {
        section: 'AB-650: Manage Microsoft 365 workloads',
        priority: 'watch',
        lectures: [
          'Create & manage teams in Microsoft Teams, including channels, owners, & members',
          'Configure settings for Copilot in Teams meetings, including transcription',
          'Create and manage SharePoint sites',
          'Manage SharePoint site roles and permissions',
          'Features and capabilities of SharePoint Advanced Management',
        ],
      },
      {
        section: 'Configure and manage a Microsoft 365 tenant',
        priority: 'skim',
        lectures: [
          'Configure and use Microsoft 365 Backup, including setup, restore, etc',
        ],
        note: 'If you already watched Backup on Day 1, skip the rewatch.',
      },
    ],
  },

  'd3-identity': {
    tip: 'Deep-dive Entra identities/roles/PIM/Graph. Skip the whole hybrid sync section for AB-650.',
    sections: [
      {
        section: 'Manage identities in Microsoft Entra',
        priority: 'watch',
        lectures: [
          'Concepts of identities in Azure/Microsoft 365/Entra ID',
          'Create and manage Microsoft 365 users',
          'Create and manage external users in Microsoft Entra',
          'Create and manage contacts in the Microsoft 365 admin center',
          'Concepts of Groups in Azure/Microsoft 365/Entra ID',
          'Create and manage groups, including Microsoft 365 groups and shared mailboxes',
          'Concepts of roles in Microsoft 365 and Microsoft Entra',
          'Implement and manage roles in Microsoft Entra',
          'Concepts of delegation by administrative units',
          'Manage delegation by using administrative units',
          'Understanding privileged identity management (PIM)',
          'Manage Microsoft Entra roles in Entra privileged identity management (PIM)',
          'Perform bulk user management',
          'Concepts of using Microsoft Graph with PowerShell management',
          'Create and manage users and groups, as well as bulk management with PowerShell',
        ],
      },
      {
        section:
          'MS-102: Implement and manage identity synchronization with Microsoft Entra tenant',
        priority: 'skip',
        note: 'Hybrid Entra Connect / Cloud Sync is MS-102-oriented and largely out of AB-650 scope.',
      },
    ],
  },

  'd4-auth': {
    tip: 'Full watch — this section maps cleanly to AB-650 authentication and Conditional Access skills.',
    sections: [
      {
        section: 'Implement and manage authentication and access in Microsoft Entra',
        priority: 'watch',
        lectures: [
          'Implement and manage authentication methods',
          'Implement and manage self-service password reset (SSPR)',
          'Implement and manage Microsoft Entra Password Protection',
          'Investigate and resolve authentication issues',
          'Plan for identity protection',
          'Implement and manage Microsoft Entra ID Protection',
          'Plan Conditional Access policies',
          'Implement and manage Conditional Access policies',
          'Concepts of multi-factor authentication (MFA)',
          'Implement multi-factor authentication (MFA) by using conditional access policies',
        ],
      },
    ],
  },

  'd5-defender': {
    tip: 'AB-650 centers on Defender for Office 365. Skim XDR reports lightly; skip Endpoint and Cloud Apps sections.',
    sections: [
      {
        section: 'Secure Microsoft 365 workloads',
        priority: 'watch',
        lectures: [
          'Understanding Defender for Office 365',
          'Implement policies and rules in Defender for Office 365',
          'Review and respond to threats identified in Defender for Office 365',
          'Create and run campaigns, such as attack simulation',
        ],
      },
      {
        section:
          'MS-102: Review & respond to security reports & alerts by Microsoft Defender XDR',
        priority: 'skim',
        note: 'Useful context only — AB-650 does not weight full XDR admin the way MS-102 did.',
      },
      {
        section:
          'MS-102: Implement & manage endpoint protection by using MS Defender for Endpoint',
        priority: 'skip',
        note: 'MS-102-oriented. Do not spend AB-650 study time here.',
      },
      {
        section: 'MS-102: Implement and manage Microsoft Defender for Cloud Apps',
        priority: 'skip',
        note: 'MS-102-oriented. Out of AB-650 focus.',
      },
    ],
  },

  'd6-purview': {
    tip: 'Watch Purview for DLP / labels / retention requirements and alert response. Pair with Microsoft Learn for DSPM for AI if the Udemy section is light there.',
    sections: [
      {
        section: 'Protect data in Microsoft 365 by using Microsoft Purview',
        priority: 'watch',
        lectures: [
          'Concepts of data loss prevention (DLP)',
          'Configure DLP policies for Exchange, SharePoint, OneDrive, and Teams',
          'Review and respond to DLP alerts, events, and reports',
          'Understanding sensitive information requirements for an organization\'s data',
          'Understanding sensitivity labels',
          'Implement sensitivity labels for items and containers',
          'Implement sensitivity label policies',
          'Understanding retention and disposition',
          'Retention labels, retention label policies, and retention policies',
        ],
        note: 'Focus on “which control meets the requirement?” — AB-650 wording is identify requirements, plus Copilot/AI locations and DSPM for AI via Learn.',
      },
    ],
  },

  'd7-copilot': {
    tip: 'Highest-priority AB-650-new Udemy section for MS-102 holders. Watch end-to-end.',
    sections: [
      {
        section: 'AB-650: Enable and manage Microsoft 365 Copilot',
        priority: 'watch',
        lectures: [
          'Assess tenant readiness for Copilot, including in-app experiences',
          'Identify and resolve data readiness issues for Copilot, data leaks, oversharing',
          'Manage web search for Copilot and Microsoft 365 Copilot Chat',
          'Configure Microsoft 365 Copilot Search',
          'Assess what Copilot is and how accesses data in your tenant',
          'Identify how Microsoft Graph and Copilot work together in your tenant',
          'Configure Copilot settings for a tenant, including self-service purchases & more',
          'Manage Copilot user licenses',
          'Configure Copilot connectors',
        ],
        note: 'If Copilot Cowork / third-party AI providers are thin in video, use the portal study panels + Learn links.',
      },
      {
        section: 'Configure and manage a Microsoft 365 tenant',
        priority: 'skim',
        lectures: [
          'Understanding the capabilities of Copilot and Agents in Microsoft 365',
        ],
        note: 'Only if you skipped this on Day 1.',
      },
    ],
  },

  'd8-agents': {
    tip: 'Watch both AB-650 agent sections. This is pure net-new vs classic MS-102.',
    sections: [
      {
        section: 'AB-650: Implement and manage agents in Microsoft 365 and Agent 365',
        priority: 'watch',
        lectures: [
          'Identify how agents perform Researcher, Analyst, and custom agent roles',
          'Configure user access to agents',
          'Configure a license for Agent 365',
          'Configure an agent',
          'Manage agent approval as an administrator',
          'Manage the lifecycle workflows for agent identities by using MS Entra Agent ID',
          'Secure agent access, including access packages and conditional access',
          'Manage agent owners',
        ],
      },
      {
        section: 'AB-650: Secure and govern agents by using Agent 365',
        priority: 'watch',
        lectures: [
          'Monitor agent activity by using Agent 365',
          'Protect sensitive data by using Agent 365',
          'Evaluate compliance gaps by using Agent 365',
        ],
      },
    ],
  },

  'd9-monitor': {
    tip: 'Short AB-650 monitoring section — watch fully, then redo incomplete portal modules.',
    sections: [
      {
        section: 'AB-650: Monitor AI services in Microsoft 365',
        priority: 'watch',
        lectures: [
          'Manage and monitor costs for AI services in Microsoft 365',
          'Monitor usage reports for Copilot in the MS365 admin center, including adoption',
          'Monitor agents, usage, operational insights, and agent lifecycle',
        ],
      },
    ],
  },

  'd10-practice': {
    tip: 'No new theory. Rewatch only sections tied to questions you miss in the portal.',
    sections: [
      {
        section: 'AB-650: Enable and manage Microsoft 365 Copilot',
        priority: 'skim',
        note: 'Rewatch only if Copilot questions were weak.',
      },
      {
        section: 'AB-650: Implement and manage agents in Microsoft 365 and Agent 365',
        priority: 'skim',
        note: 'Rewatch only if agent registry / Agent ID questions were weak.',
      },
      {
        section: 'Secure Microsoft 365 workloads',
        priority: 'skim',
        note: 'Rewatch only if Defender for Office 365 questions were weak.',
      },
      {
        section:
          'MS-102: Implement and manage identity synchronization with Microsoft Entra tenant',
        priority: 'skip',
      },
      {
        section:
          'MS-102: Implement & manage endpoint protection by using MS Defender for Endpoint',
        priority: 'skip',
      },
      {
        section: 'MS-102: Implement and manage Microsoft Defender for Cloud Apps',
        priority: 'skip',
      },
    ],
  },
}

export function getUdemyGuide(moduleId: string): UdemyWatchGuide | undefined {
  return udemyByModuleId[moduleId]
}
