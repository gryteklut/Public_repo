import type { Day } from '../types'

export const TAG_LABELS = {
  'MS-102-core': 'MS-102 core',
  'MS-102-updated': 'MS-102 updated',
  'AB-650-new': 'AB-650 new',
} as const

export const curriculum: Day[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'Tenant foundations',
    focus:
      'Refresh tenant admin: branding, domains, org settings, licensing, service health, and network insights.',
    estimatedMinutes: 60,
    modules: [
      {
        id: 'd1-tenant',
        title: 'Configure and manage a Microsoft 365 tenant',
        summary:
          'Cover the AB-650 tenant bullets that overlap MS-102, plus AI licensing and Backup awareness for later days.',
        tags: ['MS-102-core', 'MS-102-updated', 'AB-650-new'],
        studyLinks: [
          {
            label: 'AB-650 study guide — tenant skills',
            url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
          },
          {
            label: 'Microsoft 365 tenant management overview',
            url: 'https://learn.microsoft.com/en-us/microsoft-365/enterprise/microsoft-365-overview',
          },
          {
            label: 'Assign licenses to users',
            url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/manage/assign-licenses-to-users',
          },
        ],
        labSteps: [
          'In your E5 dev tenant, open Microsoft 365 admin center → Settings → Org settings and review company profile, security & privacy.',
          'Review Domains and note primary vs custom domain verification status.',
          'Open Billing → Licenses and identify group-based licensing options for a security group.',
          'Open Health → Service health and configure a sample notification preference.',
        ],
        outOfScopeNote:
          'AB-650 does not emphasize hybrid directory sync (Entra Connect) the way older MS-102 did. Do not spend time on sync troubleshooting for this exam.',
        questions: [
          {
            id: 'd1q1',
            prompt:
              'You need company branding (logo, sign-in background, and theme) to appear for users signing in to Microsoft 365. Where do you primarily configure this?',
            choices: [
              'Microsoft Entra admin center — Company branding',
              'Exchange admin center — Organization',
              'Microsoft Purview portal — Settings',
              'SharePoint admin center — Branding',
            ],
            correctIndex: 0,
            explanation:
              'Sign-in and company branding for the Microsoft 365 experience is configured in Microsoft Entra ID (Company branding), not in workload admin centers.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/fundamentals/how-to-customize-branding',
            sourceLabel: 'Add company branding to your sign-in page',
            studyContent:
              'AB-650 expects you to configure tenant branding including logo, company URL, themes, and backgrounds. For Microsoft Entra sign-in experiences, use Entra admin center → Company branding. Organizational profile details (name, address, technical contact) live under Microsoft 365 admin center → Settings → Org settings. Know which portal owns which setting — exam questions often test portal selection.',
          },
          {
            id: 'd1q2',
            prompt:
              'A custom domain was added but users cannot use it for email yet. What must typically be true before the domain is fully usable for Exchange Online?',
            choices: [
              'The domain must be verified (DNS TXT/MX as required) and set up for services',
              'You must enable Conditional Access for all users',
              'You must create an administrative unit for the domain',
              'You must enable Microsoft 365 Backup for the tenant',
            ],
            correctIndex: 0,
            explanation:
              'Custom domains require DNS verification and service setup (including MX for mail) before they are fully usable. CA, AUs, and Backup are unrelated to domain readiness.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365/admin/setup/add-domain',
            sourceLabel: 'Add a domain to Microsoft 365',
            studyContent:
              'Implementing domains on AB-650 includes adding a domain in the Microsoft 365 admin center, verifying ownership with DNS records, and configuring required records (for example MX, CNAME, TXT) so workloads like Exchange and Teams can use the domain. A domain can be verified but still incomplete for a workload until the right records exist.',
          },
          {
            id: 'd1q3',
            prompt:
              'You must assign Microsoft 365 Copilot licenses to 2,000 users with minimal ongoing admin work. Which approach best matches AB-650 licensing objectives?',
            choices: [
              'Use group-based licensing so membership drives license assignment',
              'Ask each user to buy a self-service license from the Microsoft Store',
              'Create one shared mailbox and assign the Copilot license to it',
              'Enable pay-as-you-go only — named Copilot licenses are never assigned',
            ],
            correctIndex: 0,
            explanation:
              'Group-based licensing scales assignment and removal with group membership. Shared mailboxes are not the model for Copilot user licensing; pay-as-you-go complements but does not replace user license assignment patterns tested on the exam.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/identity/users/licensing-groups-assign',
            sourceLabel: 'Assign licenses to a group',
            studyContent:
              'AB-650 explicitly measures managing Microsoft 365 licenses including group-based licensing and pay-as-you-go, plus AI service licenses (Copilot, Agent 365, Copilot Studio). For large populations, assign licenses via groups in Entra ID. Also know that AI services may involve usage-based billing you monitor separately from named seats.',
          },
          {
            id: 'd1q4',
            prompt:
              'You want admins notified when Exchange Online has an active incident. Which Microsoft 365 capability should you configure?',
            choices: [
              'Service health notifications in the Microsoft 365 admin center',
              'Defender for Office 365 attack simulation',
              'Microsoft Purview retention policies',
              'SharePoint site exclusions for Copilot',
            ],
            correctIndex: 0,
            explanation:
              'Service health (and its notification preferences) is how you monitor Microsoft 365 service incidents and advisories at tenant level.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365/enterprise/view-service-health',
            sourceLabel: 'How to check Microsoft 365 service health',
            studyContent:
              'Monitor Microsoft 365 service health in the admin center, including configuring notifications. Pair this with network connectivity insights when diagnosing client connectivity issues. These are classic tenant-admin skills that remain on AB-650 under “configure and manage a Microsoft 365 tenant.”',
          },
        ],
      },
    ],
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'Workloads for Copilot grounding',
    focus:
      'Exchange, Teams, SharePoint/OneDrive administration with Copilot-aware settings, plus Microsoft 365 Backup.',
    estimatedMinutes: 60,
    modules: [
      {
        id: 'd2-workloads',
        title: 'Manage Microsoft 365 workloads',
        summary:
          'Workload admin overlaps MS-102, but AB-650 ties Teams transcription/Copilot and SharePoint Advanced Management to Copilot grounding quality.',
        tags: ['MS-102-updated', 'AB-650-new'],
        studyLinks: [
          {
            label: 'SharePoint Advanced Management overview',
            url: 'https://learn.microsoft.com/en-us/sharepoint/advanced-management',
          },
          {
            label: 'Manage Copilot meeting scenarios in Teams',
            url: 'https://learn.microsoft.com/en-us/microsoftteams/copilot-teams-meeting',
          },
          {
            label: 'Microsoft 365 Backup',
            url: 'https://learn.microsoft.com/en-us/microsoft-365/backup/backup-overview',
          },
        ],
        labSteps: [
          'Create a shared mailbox and a Microsoft 365 group-backed Team in the E5 tenant.',
          'Locate Teams meeting policies related to transcription / Copilot.',
          'In SharePoint admin center, explore Restricted SharePoint Search / site access restriction concepts for Copilot readiness.',
          'Review Microsoft 365 Backup setup documentation against what your tenant SKU allows.',
        ],
        questions: [
          {
            id: 'd2q1',
            prompt:
              'Why do SharePoint and OneDrive permissions matter specifically for Microsoft 365 Copilot on AB-650?',
            choices: [
              'Copilot grounds responses on content the user can access; oversharing becomes an AI data readiness problem',
              'Copilot ignores SharePoint permissions and only uses public web search',
              'Copilot can only read content labeled as Public',
              'Copilot requires every site to be a Teams-connected site',
            ],
            correctIndex: 0,
            explanation:
              'Copilot respects the user’s existing permissions. Oversharing and broad permissions therefore surface as Copilot data readiness / oversharing issues on the exam.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365-copilot/guidance/copilot-oversharing',
            sourceLabel: 'Prevent oversharing with Copilot',
            studyContent:
              'AB-650 links workload configuration to Copilot quality. Create/manage SharePoint sites and permissions, then use SharePoint Advanced Management, Microsoft Search controls, and site exclusions so Copilot does not surface content that should not be discoverable. Restricted Content Discovery, Restricted SharePoint Search, and Restricted Access Control are high-value distinctions for exam scenarios.',
          },
          {
            id: 'd2q2',
            prompt:
              'You need Copilot available in Teams meetings with transcription support governed by policy. Where do you typically control meeting-related Copilot behavior?',
            choices: [
              'Teams meeting policies / admin settings for Copilot and transcription',
              'Exchange transport rules only',
              'Entra Password Protection',
              'Purview Insider Risk Management policies only',
            ],
            correctIndex: 0,
            explanation:
              'Teams meeting policies and related admin settings govern Copilot/transcription behavior in meetings — an explicit AB-650 workload objective.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-copilot-meetings',
            sourceLabel: 'Manage Microsoft 365 Copilot in Teams meetings',
            studyContent:
              'Under “Manage Microsoft 365 workloads,” AB-650 includes configuring settings for Copilot in Teams meetings, including transcription. Know that meeting policies can allow/limit Copilot experiences and that transcription/recap features interact with compliance and privacy settings in the tenant.',
          },
          {
            id: 'd2q3',
            prompt:
              'Which statement about Microsoft 365 Backup aligns with AB-650 skills measured?',
            choices: [
              'Admins should know how to set up, restore, and monitor Microsoft 365 Backup',
              'Microsoft 365 Backup replaces the need for retention labels',
              'Microsoft 365 Backup is only available for on-premises Exchange',
              'Microsoft 365 Backup is configured exclusively in Defender XDR',
            ],
            correctIndex: 0,
            explanation:
              'AB-650 lists configure and use Microsoft 365 Backup including setup, restore, and monitor. It does not replace Purview retention, and it is not a Defender XDR console feature.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365/backup/backup-overview',
            sourceLabel: 'Microsoft 365 Backup overview',
            studyContent:
              'Microsoft 365 Backup is called out on AB-650 tenant skills. Understand product purpose (operational restore for supported workloads), high-level setup, restore workflows, and monitoring — distinct from Purview retention (compliance) and from Defender threat protection.',
          },
          {
            id: 'd2q4',
            prompt:
              'A site contains sensitive drafts that should not be discoverable by Copilot while a permissions review is underway. Which control family is most relevant?',
            choices: [
              'SharePoint restriction / exclusion controls (for example Restricted Content Discovery or related SAM controls)',
              'Disabling MFA for the site owners',
              'Deleting the Microsoft 365 tenant Service health feed',
              'Converting all users to guest accounts',
            ],
            correctIndex: 0,
            explanation:
              'SharePoint Advanced Management and Copilot-related restriction/exclusion controls are designed for scenarios where content should not be grounded/discovered while access is remediated.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery',
            sourceLabel: 'Restricted Content Discovery',
            studyContent:
              'When preparing a tenant for Copilot, you often need to exclude or restrict sites from search/discovery while fixing oversharing. Learn the difference between cutting off Copilot discovery versus changing permissions versus applying sensitivity/DLP. Exam scenarios frequently describe “permissions review in progress” as the trigger.',
          },
        ],
      },
    ],
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'Entra identities',
    focus:
      'Cloud identity governance: users, guests, groups, roles/PIM, administrative units, contacts, Graph PowerShell bulk ops.',
    estimatedMinutes: 60,
    modules: [
      {
        id: 'd3-identity',
        title: 'Manage identities in Microsoft Entra',
        summary:
          'Strong MS-102 overlap. Focus on cloud identity — skip hybrid sync deep dives.',
        tags: ['MS-102-core', 'MS-102-updated'],
        studyLinks: [
          {
            label: 'Microsoft Entra ID governance overview',
            url: 'https://learn.microsoft.com/en-us/entra/id-governance/identity-governance-overview',
          },
          {
            label: 'Privileged Identity Management',
            url: 'https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure',
          },
          {
            label: 'Administrative units',
            url: 'https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/administrative-units',
          },
        ],
        labSteps: [
          'Create a user, a Microsoft 365 group, and a security group.',
          'Invite a guest and review External collaboration settings.',
          'Create an administrative unit and assign a scoped role if licensing allows.',
          'Open PIM and review an eligible role assignment workflow.',
        ],
        outOfScopeNote:
          'Hybrid identity / Entra Connect sync troubleshooting is largely out of AB-650 scope compared with classic MS-102.',
        questions: [
          {
            id: 'd3q1',
            prompt:
              'You need helpdesk staff to manage only users in the Norway division. Which Entra feature best scopes their admin rights?',
            choices: [
              'Administrative units with scoped role assignments',
              'A single Global Administrator account shared by helpdesk',
              'Disabling PIM for all roles',
              'Assigning Exchange Online-only licenses',
            ],
            correctIndex: 0,
            explanation:
              'Administrative units let you scope role permissions to a subset of users/groups/devices — a measured AB-650 identity skill.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/administrative-units',
            sourceLabel: 'Administrative units in Microsoft Entra ID',
            studyContent:
              'Administrative units (AUs) partition a tenant for delegated administration. Combine AUs with scoped directory roles so operators can manage only their population. This is preferred over over-privileged global roles.',
          },
          {
            id: 'd3q2',
            prompt:
              'Why is Microsoft Entra Privileged Identity Management (PIM) important for Microsoft 365 admin roles on AB-650?',
            choices: [
              'It enables just-in-time eligible role activation with controls instead of standing privileged access',
              'It replaces Conditional Access entirely',
              'It is only used for guest B2B redemption',
              'It automatically verifies custom domains',
            ],
            correctIndex: 0,
            explanation:
              'PIM provides eligible, time-bound activation of privileged roles — core to governing Microsoft 365 admin roles.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure',
            sourceLabel: 'What is Microsoft Entra Privileged Identity Management?',
            studyContent:
              'AB-650 includes managing roles for Microsoft 365, including PIM. Know eligible vs permanent assignments, activation, approval, MFA on activation, and access reviews as governance patterns for privileged roles.',
          },
          {
            id: 'd3q3',
            prompt:
              'You must create 500 users from a CSV with consistent attributes. Which approach matches the bulk management objective?',
            choices: [
              'Use Microsoft Graph PowerShell (or Graph APIs) for bulk create/update operations',
              'Create each user only from the Teams mobile app',
              'Use Purview DLP to provision identities',
              'Enable Copilot Cowork to create Entra users automatically without Graph',
            ],
            correctIndex: 0,
            explanation:
              'Bulk management including Microsoft Graph PowerShell is an explicit skills-measured bullet under Entra identity management.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview',
            sourceLabel: 'Microsoft Graph PowerShell overview',
            studyContent:
              'AB-650 expects familiarity with Microsoft Graph PowerShell for bulk identity operations (create users, update attributes, group membership). Practice Connect-MgGraph, least-privilege Graph permissions, and batching patterns at a conceptual level.',
          },
          {
            id: 'd3q4',
            prompt:
              'External contractors need access to a Teams-connected site. Which identity construct is the usual starting point?',
            choices: [
              'Guest users with external access / B2B collaboration settings governed appropriately',
              'Always create permanent Global Administrator accounts for contractors',
              'Disable all Conditional Access for guests by policy requirement',
              'Store contractor passwords in a SharePoint list for shared login',
            ],
            correctIndex: 0,
            explanation:
              'Guest/B2B users plus external collaboration settings are the standard model; AB-650 calls out managing guest users and external access settings.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b',
            sourceLabel: 'B2B collaboration overview',
            studyContent:
              'Manage guest users and external access settings: invitation redemption, cross-tenant access, guest permissions (what guests can do), and how guests appear in groups/Teams. Pair with Conditional Access for guests when securing access.',
          },
        ],
      },
    ],
  },
  {
    id: 'day-4',
    dayNumber: 4,
    title: 'Authentication and Conditional Access',
    focus:
      'Auth methods, Password Protection, SSPR, troubleshooting, Conditional Access, MFA, and ID Protection.',
    estimatedMinutes: 60,
    modules: [
      {
        id: 'd4-auth',
        title: 'Implement and manage authentication and access',
        summary:
          'Classic MS-102-core strength. Be sharp on CA policy logic and auth method strength.',
        tags: ['MS-102-core'],
        studyLinks: [
          {
            label: 'Conditional Access overview',
            url: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview',
          },
          {
            label: 'Authentication methods',
            url: 'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-methods',
          },
          {
            label: 'SSPR',
            url: 'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sspr-howitworks',
          },
        ],
        labSteps: [
          'Review Authentication methods policy in Entra.',
          'Confirm SSPR registration and reset portal behavior for a test user.',
          'Create a report-only Conditional Access policy requiring MFA for admins.',
          'Review Identity Protection risk detections at a high level.',
        ],
        questions: [
          {
            id: 'd4q1',
            prompt:
              'Which statement best describes Microsoft Entra Conditional Access?',
            choices: [
              'It evaluates signals and enforces controls such as MFA or blocking access based on policy conditions',
              'It is a Purview retention label type',
              'It replaces DNS verification for custom domains',
              'It is only available for on-premises Active Directory Domain Services',
            ],
            correctIndex: 0,
            explanation:
              'Conditional Access is the policy engine that uses conditions (user, app, location, risk, device) to grant, require MFA, or block.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview',
            sourceLabel: 'What is Conditional Access?',
            studyContent:
              'AB-650 includes implementing Conditional Access policies, including Microsoft Entra ID Protection and multifactor authentication. Master assignments (users/groups/roles), cloud apps, conditions, grant controls, session controls, and report-only mode. Know how ID Protection risk states feed CA.',
          },
          {
            id: 'd4q2',
            prompt:
              'Users must reset forgotten passwords without a helpdesk ticket. Which capability do you configure?',
            choices: [
              'Self-service password reset (SSPR)',
              'Microsoft 365 Backup restore',
              'Attack simulation training',
              'SharePoint site exclusions',
            ],
            correctIndex: 0,
            explanation:
              'SSPR lets users reset passwords after registering authentication methods — an explicit AB-650 objective.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sspr-howitworks',
            sourceLabel: 'How it works: Microsoft Entra self-service password reset',
            studyContent:
              'Configure SSPR: who is in scope, which authentication methods are required for reset, registration campaign, and writeback considerations if hybrid existed (remember hybrid is de-emphasized on AB-650). Also know how to investigate authentication issues from sign-in logs.',
          },
          {
            id: 'd4q3',
            prompt:
              'Microsoft Entra Password Protection helps primarily by:',
            choices: [
              'Blocking banned/weak passwords and enforcing custom banned password lists',
              'Encrypting SharePoint files at rest with customer keys automatically',
              'Assigning Copilot licenses via groups',
              'Publishing agents in the agent registry',
            ],
            correctIndex: 0,
            explanation:
              'Password Protection detects and blocks known weak/banned passwords for cloud (and optionally hybrid) scenarios.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/identity/authentication/concept-password-ban-bad',
            sourceLabel: 'Eliminate bad passwords using Microsoft Entra Password Protection',
            studyContent:
              'Implement and manage Microsoft Entra Password Protection: global banned password list, custom banned passwords, and how it applies to change/reset flows. This is a discrete bullet under authentication skills.',
          },
          {
            id: 'd4q4',
            prompt:
              'A user cannot complete MFA. Which admin artifact is most useful first when investigating authentication issues?',
            choices: [
              'Microsoft Entra sign-in logs for the user (failure reason / MFA detail)',
              'SharePoint site usage reports only',
              'Exchange message trace for a week-old newsletter',
              'Copilot adoption reports by workload',
            ],
            correctIndex: 0,
            explanation:
              'Sign-in logs provide failure reasons, CA results, and MFA details needed to troubleshoot authentication issues.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-ins',
            sourceLabel: 'Sign-in logs in Microsoft Entra ID',
            studyContent:
              'Investigate and resolve authentication issues using Entra sign-in logs, authentication methods registration, CA “What If” / report-only results, and MFA prompt errors. Exam questions often describe a symptom and expect the correct diagnostic location.',
          },
        ],
      },
    ],
  },
  {
    id: 'day-5',
    dayNumber: 5,
    title: 'Defender for Office 365',
    focus:
      'Threat protection narrowed to email and collaboration: alerts, policies, investigation, attack simulation.',
    estimatedMinutes: 60,
    modules: [
      {
        id: 'd5-defender',
        title: 'Secure Microsoft 365 workloads',
        summary:
          'MS-102-updated: AB-650 focuses Defender coverage on Office 365 rather than full XDR admin across every Defender workload.',
        tags: ['MS-102-updated'],
        studyLinks: [
          {
            label: 'Microsoft Defender for Office 365',
            url: 'https://learn.microsoft.com/en-us/defender-office-365/mdo-about',
          },
          {
            label: 'Threat policies',
            url: 'https://learn.microsoft.com/en-us/defender-office-365/protect-against-threats',
          },
          {
            label: 'Attack simulation training',
            url: 'https://learn.microsoft.com/en-us/defender-office-365/attack-simulation-training-get-started',
          },
        ],
        labSteps: [
          'In Defender portal, review Email & collaboration alerts.',
          'Inspect preset security policies vs custom anti-phishing / safe links / safe attachments.',
          'Open Attack simulation training and review campaign concepts.',
        ],
        outOfScopeNote:
          'Deep configuration of Defender for Endpoint, Identity, and Cloud Apps as separate MS-102 XDR domains is not the AB-650 focus. Know XDR exists; configure for Office 365 threats.',
        questions: [
          {
            id: 'd5q1',
            prompt:
              'Compared with classic MS-102, how is security coverage framed on AB-650?',
            choices: [
              'Threat protection objectives center on Defender for Office 365 for email and collaboration',
              'You must exclusively configure Defender for Endpoint onboarding policies',
              'Security is removed entirely from the exam',
              'Only on-premises antimalware is tested',
            ],
            correctIndex: 0,
            explanation:
              'AB-650 skills measured list Defender for Office 365 alerts, threat policies, investigation, and attack simulations — not the full prior XDR breadth.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/defender-office-365/mdo-about',
            sourceLabel: 'Microsoft Defender for Office 365',
            studyContent:
              'Secure Microsoft 365 workloads on AB-650 means: manage alerts in Defender for Office 365; configure threat policies and rules; investigate/respond to email and collaboration threats; configure attack simulations including training campaigns. Broad Defender XDR literacy helps contextually, but exam bullets are Office 365-centric.',
          },
          {
            id: 'd5q2',
            prompt:
              'Safe Links and Safe Attachments are examples of:',
            choices: [
              'Defender for Office 365 threat protection policies',
              'Purview retention label settings',
              'Entra administrative unit templates',
              'Copilot connector authentication methods',
            ],
            correctIndex: 0,
            explanation:
              'Safe Links/Safe Attachments are core Defender for Office 365 threat policies protecting email and collaboration content.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/defender-office-365/safe-attachments-about',
            sourceLabel: 'Safe Attachments in Microsoft Defender for Office 365',
            studyContent:
              'Threat policies include anti-phishing, anti-spam, anti-malware, Safe Links, Safe Attachments, and related presets. Know who policies apply to, priority/order concepts at a high level, and how overrides/allow/block lists can affect outcomes.',
          },
          {
            id: 'd5q3',
            prompt:
              'Security team wants to measure user susceptibility to phishing and assign training. Which capability fits?',
            choices: [
              'Attack simulation training campaigns in Defender for Office 365',
              'Microsoft 365 Backup restore jobs',
              'SharePoint hub site association',
              'Entra company branding themes',
            ],
            correctIndex: 0,
            explanation:
              'Attack simulation training (including campaigns) is an explicit AB-650 Defender for Office 365 objective.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/defender-office-365/attack-simulation-training-get-started',
            sourceLabel: 'Get started using Attack simulation training',
            studyContent:
              'Configure and manage attack simulations, including training campaigns: select payloads, target groups, schedule simulations, and assign training based on results. This is both a security control and a measured exam skill.',
          },
          {
            id: 'd5q4',
            prompt:
              'An alert indicates a user clicked a malicious link in email. Where do you primarily investigate email/collaboration threats?',
            choices: [
              'Microsoft Defender portal — email & collaboration investigation / alerts / Explorer (as licensed)',
              'Only the Word desktop File menu',
              'Only DNS TXT records for the tenant domain',
              'Only the Copilot Studio topic designer',
            ],
            correctIndex: 0,
            explanation:
              'Investigation and response for email/collaboration threats is done in the Defender portal experiences for Office 365.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/defender-office-365/email-security-in-microsoft-defender',
            sourceLabel: 'Email security in Microsoft Defender',
            studyContent:
              'Investigate and respond using alerts, incidents (where correlated), Email entity pages, Threat Explorer/Real-time detections (Plan dependent), and remediation actions (soft delete, etc.). Tie alerts management to triage workflow.',
          },
        ],
      },
    ],
  },
  {
    id: 'day-6',
    dayNumber: 6,
    title: 'Purview and DSPM for AI',
    focus:
      'Identify DLP, information protection, and retention requirements — plus AI activity monitoring with DSPM for AI.',
    estimatedMinutes: 60,
    modules: [
      {
        id: 'd6-purview',
        title: 'Protect data with Microsoft Purview',
        summary:
          'MS-102-updated framing (“identify requirements”) plus AB-650-new DSPM for AI and Copilot DLP scope.',
        tags: ['MS-102-updated', 'AB-650-new'],
        studyLinks: [
          {
            label: 'Purview DLP',
            url: 'https://learn.microsoft.com/en-us/purview/dlp-learn-about-dlp',
          },
          {
            label: 'Sensitivity labels',
            url: 'https://learn.microsoft.com/en-us/purview/sensitivity-labels',
          },
          {
            label: 'DSPM for AI',
            url: 'https://learn.microsoft.com/en-us/purview/dspm-for-ai',
          },
        ],
        labSteps: [
          'In Purview portal, review DLP policy locations including modern locations relevant to Copilot/AI if shown.',
          'Inspect an existing sensitivity label policy and retention policy structure.',
          'Open DSPM for AI overview docs and map reports/controls to Copilot prompts/responses.',
        ],
        questions: [
          {
            id: 'd6q1',
            prompt:
              'AB-650 Purview objectives emphasize that you can:',
            choices: [
              'Identify requirements for DLP, information protection, and data lifecycle management across Microsoft 365 and Copilot',
              'Only configure on-premises file server quotas',
              'Replace all Conditional Access with retention labels',
              'Disable Graph PowerShell permanently as a compliance control',
            ],
            correctIndex: 0,
            explanation:
              'Skills measured use “identify requirements” for DLP, information protection, and retention — including Copilot locations — plus review DLP alerts and DSPM for AI.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
            sourceLabel: 'AB-650 study guide — Purview skills',
            studyContent:
              'Know when to recommend DLP policies (Exchange, SharePoint, OneDrive, Teams, endpoints, Copilot), sensitivity information types/labels/policies, and retention labels vs retention policies. You may not always be asked to click every blade — you must map business requirements to the right Purview control.',
          },
          {
            id: 'd6q2',
            prompt:
              'Which Purview capability is specifically highlighted for monitoring and securing AI activity?',
            choices: [
              'Data Security Posture Management (DSPM) for AI',
              'Attack simulation training',
              'Entra Password Protection',
              'Teams channel naming policies',
            ],
            correctIndex: 0,
            explanation:
              'Monitor and secure AI activity by using Microsoft Purview DSPM for AI is an explicit AB-650 bullet.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/purview/dspm-for-ai',
            sourceLabel: 'Data Security Posture Management for AI',
            studyContent:
              'DSPM for AI helps you see AI usage posture: prompts/responses as data, oversharing risks, and recommended controls. Pair with DLP for Copilot interactions. This is a high-value AB-650-new topic for MS-102 holders.',
          },
          {
            id: 'd6q3',
            prompt:
              'Sensitivity labels primarily help you:',
            choices: [
              'Classify and protect content (and related containers) according to information protection policies',
              'Assign Copilot licenses to security groups',
              'Verify custom DNS domains',
              'Run Safe Attachments detonation exclusively',
            ],
            correctIndex: 0,
            explanation:
              'Information protection requirements include sensitive information types, sensitivity labels, and label policies.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/purview/sensitivity-labels',
            sourceLabel: 'Learn about sensitivity labels',
            studyContent:
              'Identify requirements for information protection: SITs detect sensitive data; sensitivity labels apply classification/protection; label policies publish labels to users/groups. Understand auto-labeling concepts at requirement level for exam scenarios.',
          },
          {
            id: 'd6q4',
            prompt:
              'A DLP policy alerts on sensitive content leaving via Microsoft 365. What should admins be able to do per AB-650?',
            choices: [
              'Review and respond to DLP alerts for Microsoft 365 and AI services',
              'Ignore alerts because Copilot bypasses DLP by design',
              'Convert DLP alerts into Exchange MX records',
              'Use DLP alerts to create Entra administrative units',
            ],
            correctIndex: 0,
            explanation:
              'Reviewing and responding to DLP alerts for Microsoft 365 and AI services is explicitly measured.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/purview/dlp-alerts-dashboard-get-started',
            sourceLabel: 'Get started with the DLP alert management dashboard',
            studyContent:
              'DLP alert management: triage alert severity, matched SITs, user/activity context, and respond (notify, confirm false positive, escalate). Include AI services in your mental model — prompts/responses and Copilot interactions can be in scope depending on policy design.',
          },
        ],
      },
    ],
  },
  {
    id: 'day-7',
    dayNumber: 7,
    title: 'Enable and manage Copilot',
    focus:
      'AB-650-new core: readiness, oversharing, web search, Copilot Search, tenant settings, Cowork, connectors, third-party AI.',
    estimatedMinutes: 60,
    modules: [
      {
        id: 'd7-copilot',
        title: 'Enable and manage Microsoft 365 Copilot',
        summary:
          'Highest priority new domain content for MS-102 holders. Use E5 tenant for admin settings; use work Copilot Cowork for end-user familiarity.',
        tags: ['AB-650-new'],
        studyLinks: [
          {
            label: 'Microsoft 365 Copilot requirements',
            url: 'https://learn.microsoft.com/en-us/microsoft-365-copilot/microsoft-365-copilot-requirements',
          },
          {
            label: 'Copilot Control System',
            url: 'https://learn.microsoft.com/en-us/copilot/control-system/overview',
          },
          {
            label: 'Copilot connectors',
            url: 'https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-graph-connector',
          },
        ],
        labSteps: [
          'In E5 tenant, review Copilot-related settings in Microsoft 365 admin center (what your license exposes).',
          'Map data readiness: pick one SharePoint site and evaluate sharing links / membership sprawl.',
          'At work (no admin portal), use Copilot Cowork as an end user and note admin-controlled behaviors you cannot change.',
        ],
        questions: [
          {
            id: 'd7q1',
            prompt:
              'What is a primary tenant readiness concern before enabling Copilot broadly?',
            choices: [
              'Data oversharing and permissions hygiene so Copilot does not surface content users should not see',
              'Disabling TLS on all endpoints',
              'Removing all sensitivity labels',
              'Turning off Service health notifications permanently',
            ],
            correctIndex: 0,
            explanation:
              'Assess readiness and remediate data leaks/oversharing/compliance issues — core Copilot enablement skills.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365-copilot/guidance/copilot-oversharing',
            sourceLabel: 'Prevent oversharing with Microsoft 365 Copilot',
            studyContent:
              'Enable and manage Copilot starts with readiness: licenses, in-app experiences, and especially data readiness. Copilot uses Microsoft Graph content the user can access. Oversharing (Everyone links, broad group membership) becomes an AI risk. Remediate with permissions cleanup, SAM controls, labels/DLP, and site restrictions.',
          },
          {
            id: 'd7q2',
            prompt:
              'Managing web search for Copilot / Copilot Chat primarily controls:',
            choices: [
              'Whether Copilot can ground on public web content in addition to tenant content (per policy/config)',
              'Whether MX records are published for the tenant',
              'Whether PIM activations require approval',
              'Whether Safe Attachments detonates files',
            ],
            correctIndex: 0,
            explanation:
              'Web search grounding is an admin-governed Copilot capability called out in AB-650 skills.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365-copilot/manage-web-access',
            sourceLabel: 'Manage web access for Copilot',
            studyContent:
              'Manage web search for Copilot and Microsoft 365 Copilot Chat, and configure Copilot Search. Understand tenant settings such as self-service purchases, Copilot in admin centers, release preferences, AI disclaimer, and video/image generation. Know where these toggles live conceptually in admin experiences / Control System.',
          },
          {
            id: 'd7q3',
            prompt:
              'Microsoft 365 Copilot Cowork is best described as:',
            choices: [
              'A Copilot experience/capability admins must be able to manage as part of Copilot user experiences',
              'A replacement for Entra Conditional Access',
              'A Defender for Office 365 Safe Links policy type',
              'An Exchange hybrid connector',
            ],
            correctIndex: 0,
            explanation:
              'Manage Microsoft 365 Copilot Cowork is an explicit bullet under Enable and manage Microsoft 365 Copilot.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
            sourceLabel: 'AB-650 study guide — Copilot Cowork skill',
            studyContent:
              'AB-650 lists managing Copilot user experiences and specifically Microsoft 365 Copilot Cowork. Learn what Cowork is positioned as in current Microsoft documentation, how it differs from classic chat/in-app Copilot surfaces, and which admin controls govern availability. Hands-on at work helps memorably, even without job admin rights.',
          },
          {
            id: 'd7q4',
            prompt:
              'Copilot connectors are used to:',
            choices: [
              'Bring external/line-of-business data into Microsoft Graph so Copilot can ground on it (when configured and permitted)',
              'Replace MFA authentication methods',
              'Create DNS zones for custom domains',
              'Disable Purview audit automatically',
            ],
            correctIndex: 0,
            explanation:
              'Configure Copilot connectors is measured; connectors expand grounding beyond built-in M365 content.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-graph-connector',
            sourceLabel: 'Graph connectors and Copilot',
            studyContent:
              'Configure Copilot connectors and manage third-party AI providers. Connectors index external content into Graph with schema/permissions considerations. Third-party AI provider governance is about what non-Microsoft AI is allowed and how it is controlled in the tenant.',
          },
          {
            id: 'd7q5',
            prompt:
              'Which admin mindset matches AB-650 Copilot configuration questions?',
            choices: [
              'Know which control and which portal/experience configures a stated Copilot behavior',
              'Assume all Copilot settings are exclusively end-user toggles with no tenant admin surface',
              'Assume Copilot ignores Microsoft 365 permissions',
              'Assume Copilot requires Entra Connect hybrid sync',
            ],
            correctIndex: 0,
            explanation:
              'Exam items are framed around configure/manage/govern — portal and control selection matters.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/copilot/control-system/overview',
            sourceLabel: 'Copilot Control System overview',
            studyContent:
              'Study Copilot settings as a map: licensing, data readiness, web grounding, Search, connectors, user experiences, Cowork, and third-party AI. The Copilot Control System is increasingly the governance/monitoring umbrella — Day 9 expands cost/usage/health monitoring there.',
          },
        ],
      },
    ],
  },
  {
    id: 'day-8',
    dayNumber: 8,
    title: 'Agents and Agent 365',
    focus:
      'Entra Agent ID, registry lifecycle, owners, access packages/CA for agents, tools, and Agent 365 governance.',
    estimatedMinutes: 60,
    modules: [
      {
        id: 'd8-agents',
        title: 'Implement, manage, and govern agents',
        summary:
          'Pure AB-650-new. Expect scenario questions on identity, ownership, registry approval, and securing agent access.',
        tags: ['AB-650-new'],
        studyLinks: [
          {
            label: 'Microsoft Agent 365 overview',
            url: 'https://learn.microsoft.com/en-us/microsoft-agent-365/',
          },
          {
            label: 'Entra Agent ID concepts',
            url: 'https://learn.microsoft.com/en-us/entra/agent-id/overview',
          },
          {
            label: 'AB-650 agent skills measured',
            url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
          },
        ],
        labSteps: [
          'Read Entra Agent ID lifecycle docs and sketch owner vs sponsor vs agent identity.',
          'In whatever admin experiences your E5/Frontier licensing exposes, locate agent registry / Agent 365 blades — note gaps if SKU-limited.',
          'Map Conditional Access / access package ideas onto agent identities (conceptually if UI unavailable).',
        ],
        questions: [
          {
            id: 'd8q1',
            prompt:
              'Microsoft Entra Agent ID is primarily about:',
            choices: [
              'Giving agents identities with lifecycle workflows you can manage like other identities needing ownership and access control',
              'Replacing MX records for email delivery',
              'A Safe Attachments policy template',
              'A SharePoint hub site template',
            ],
            correctIndex: 0,
            explanation:
              'Manage lifecycle workflows for agent identities using Microsoft Entra Agent ID is a first-class AB-650 skill.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/agent-id/overview',
            sourceLabel: 'Microsoft Entra Agent ID overview',
            studyContent:
              'Agents are not just bots in a gallery — they have identities. Manage lifecycle (create, own, sponsor, retire), secure access with access packages and Conditional Access, and manage owners. When an owner leaves, governance must cover transfer/disable patterns.',
          },
          {
            id: 'd8q2',
            prompt:
              'The agent registry is used to:',
            choices: [
              'Discover, review, publish/reject, install, block, or control access to Microsoft and third-party agents (including uploading custom agents)',
              'Store only DNS PTR records',
              'Replace Purview audit logs',
              'Host Exchange hybrid free/busy only',
            ],
            correctIndex: 0,
            explanation:
              'AB-650 lists discover/manage agents in the registry, review requests, publish/reject, install/block/control access, and upload custom agents.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
            sourceLabel: 'AB-650 study guide — agent registry skills',
            studyContent:
              'Treat the agent registry as the inventory and control plane: what agents exist, what is pending approval, what is published, what is blocked, and who can use them. Also configure agent settings: allowed agent types, sharing, templates, and user access.',
          },
          {
            id: 'd8q3',
            prompt:
              'Securing agent access with access packages and Conditional Access implies agents are treated as:',
            choices: [
              'Identities that can be granted least-privilege, time-bound, policy-governed access to resources',
              'Unmanageable external websites that cannot be governed',
              'Only physical devices in Autopilot',
              'Only shared mailboxes',
            ],
            correctIndex: 0,
            explanation:
              'Skills measured explicitly include securing agent access with access packages and Conditional Access.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-overview',
            sourceLabel: 'Entitlement management / access packages overview',
            studyContent:
              'Combine identity governance (access packages, reviews) with Conditional Access targeted at agent identities. Think: just enough access, auditable assignments, and policy enforcement similar in spirit to human privileged access — adapted to agents.',
          },
          {
            id: 'd8q4',
            prompt:
              'Agent 365 governance skills include monitoring activity, protecting sensitive data, and:',
            choices: [
              'Evaluating compliance gaps using Agent 365',
              'Disabling Microsoft Graph permanently for all humans',
              'Removing all sensitivity labels tenant-wide',
              'Turning off MFA for Global Administrators',
            ],
            correctIndex: 0,
            explanation:
              'Secure and govern agents by using Agent 365 includes monitor activity, protect sensitive data, and evaluate compliance gaps.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-agent-365/',
            sourceLabel: 'Microsoft Agent 365',
            studyContent:
              'Beyond build/publish: operate agents. Monitor agent activity, apply data protection, evaluate compliance gaps, and manage tools available to agents in Agent 365. This is governance/ops, not just enablement.',
          },
        ],
      },
    ],
  },
  {
    id: 'day-9',
    dayNumber: 9,
    title: 'Monitor AI and catch up',
    focus:
      'AI cost, usage, Copilot Control System, adoption reports — then redo incomplete modules.',
    estimatedMinutes: 60,
    modules: [
      {
        id: 'd9-monitor',
        title: 'Monitor AI services in Microsoft 365',
        summary:
          'Close the AI domain with cost and health monitoring. Use leftover time to reopen unfinished modules from Days 1–8.',
        tags: ['AB-650-new'],
        studyLinks: [
          {
            label: 'Copilot Control System overview',
            url: 'https://learn.microsoft.com/en-us/copilot/control-system/overview',
          },
          {
            label: 'Microsoft 365 admin center usage reports',
            url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/activity-reports',
          },
          {
            label: 'AB-650 monitor AI skills',
            url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
          },
        ],
        labSteps: [
          'In Microsoft 365 admin center, open Reports / Copilot-related adoption experiences available in your tenant.',
          'Read Copilot Control System docs for usage, adoption, cost, and service health monitoring.',
          'List your incomplete portal modules and schedule redo before Day 10.',
        ],
        questions: [
          {
            id: 'd9q1',
            prompt:
              'Where do you commonly monitor Copilot workload-level adoption details in Microsoft 365?',
            choices: [
              'Usage reports in the Microsoft 365 admin center (Copilot adoption/usage experiences)',
              'Only DNS secondary zones',
              'Only the Windows Event Viewer on a domain controller',
              'Only Exchange Offline Address Book generation logs',
            ],
            correctIndex: 0,
            explanation:
              'AB-650 lists monitoring usage reports for Copilot in the Microsoft 365 admin center, including workload-level adoption details.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/microsoft-365-copilot-usage',
            sourceLabel: 'Microsoft 365 Copilot usage report',
            studyContent:
              'Monitor usage reports for Copilot in the Microsoft 365 admin center, including workload-level adoption. Know what adoption metrics help you prove value and spot underused workloads after license assignment.',
          },
          {
            id: 'd9q2',
            prompt:
              'The Copilot Control System is positioned as a place to:',
            choices: [
              'Monitor usage/adoption and service health for AI services (and related governance controls)',
              'Replace Entra ID as the identity provider',
              'Host MX and SPF records',
              'Detonate email attachments instead of Safe Attachments',
            ],
            correctIndex: 0,
            explanation:
              'Skills measured include monitoring usage/adoption and service health via the Copilot Control System.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/copilot/control-system/overview',
            sourceLabel: 'Copilot Control System overview',
            studyContent:
              'Use Copilot Control System concepts for AI operations: adoption, health, and governance visibility. Pair with cost management for AI services (credits, pay-as-you-go, chargeback thinking).',
          },
          {
            id: 'd9q3',
            prompt:
              'Managing costs for AI services in Microsoft 365 may involve:',
            choices: [
              'Monitoring usage-based consumption / Copilot-related cost signals and applying governance to limit waste',
              'Deleting the tenant to reduce invoice complexity',
              'Disabling TLS to reduce compute',
              'Assigning Global Administrator to all users for cheaper licensing',
            ],
            correctIndex: 0,
            explanation:
              'Manage and monitor costs for AI services is an explicit monitoring-domain bullet.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-credits',
            sourceLabel: 'Copilot Credits / cost related documentation',
            studyContent:
              'AI introduces usage-based cost dimensions (credits, pay-as-you-go, agents). Know that cost monitoring is an exam topic: attribute consumption, spot spikes, and apply admin controls so AI spend stays intentional.',
          },
          {
            id: 'd9q4',
            prompt:
              'Before Day 10 practice, the most effective catch-up strategy in this portal is:',
            choices: [
              'Filter incomplete modules — prioritize AB-650-new tags first if time is short',
              'Only reread hybrid Entra Connect sync error codes',
              'Skip all security domains because MS-102 covered them forever',
              'Mark modules complete without answering questions',
            ],
            correctIndex: 0,
            explanation:
              'For MS-102 holders, AB-650-new content is the highest failure risk; the portal tags exist to drive that prioritization.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
            sourceLabel: 'AB-650 study guide',
            studyContent:
              'Days 1–6 refresh shared skills; Days 7–9 carry most net-new weight. Use the portal progress bar and tag filter. Expand study panels on missed questions, then unlock Done only when every control question is correct.',
          },
        ],
      },
    ],
  },
  {
    id: 'day-10',
    dayNumber: 10,
    title: 'Mixed practice set',
    focus:
      'Quiz-first dry run across domains. Study panels stay available if you need a hint, but treat this as exam practice.',
    estimatedMinutes: 60,
    isPracticeDay: true,
    modules: [
      {
        id: 'd10-practice',
        title: 'Cross-domain practice exam set',
        summary:
          'No new theory. Answer all questions correctly to mark the practice module complete. Review every miss via explanation + Learn link.',
        tags: ['MS-102-core', 'MS-102-updated', 'AB-650-new'],
        studyLinks: [
          {
            label: 'AB-650 study guide (all domains)',
            url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
          },
          {
            label: 'Exam AB-650 page',
            url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-650/',
          },
        ],
        questions: [
          {
            id: 'd10q1',
            prompt:
              'Which AB-650 domain carries the largest listed weight?',
            choices: [
              'Govern and secure Microsoft 365 tenants and workloads (40–45%)',
              'Configure and manage Microsoft 365 tenants and workloads (20–25%)',
              'Hybrid Exchange classic public folders (90–95%)',
              'On-premises WSUS only (50–55%)',
            ],
            correctIndex: 0,
            explanation:
              'Official skills at a glance list govern/secure at 40–45%, AI services 35–40%, tenant/workloads 20–25%.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
            sourceLabel: 'AB-650 skills at a glance',
            studyContent:
              'Memorize the three domain weights. Even as an MS-102 holder, do not under-study AI (35–40%). Governance/security remains the single largest block.',
          },
          {
            id: 'd10q2',
            prompt:
              'Copilot returns content from a SharePoint site that should still be under permissions review. Which response is most aligned with AB-650?',
            choices: [
              'Apply SharePoint restriction/exclusion controls and remediate oversharing/permissions',
              'Disable Entra ID MFA tenant-wide',
              'Delete Service health',
              'Convert the site to a public anonymous FTP server',
            ],
            correctIndex: 0,
            explanation:
              'Data readiness and SharePoint controls for Copilot grounding are core AB-650 themes.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery',
            sourceLabel: 'Restricted Content Discovery',
            studyContent:
              'Scenario pattern: Copilot surfaces sensitive drafts → fix discovery/permissions, not identity fundamentals unrelated to the symptom.',
          },
          {
            id: 'd10q3',
            prompt:
              'Just-in-time elevation for Global Reader vs standing Global Administrator is primarily a job for:',
            choices: [
              'Microsoft Entra Privileged Identity Management (PIM)',
              'Safe Links policies',
              'Microsoft 365 Backup',
              'Teams meeting templates only',
            ],
            correctIndex: 0,
            explanation:
              'PIM governs eligible privileged role activation.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure',
            sourceLabel: 'Privileged Identity Management',
            studyContent:
              'Standing privileged roles are a governance smell. PIM eligible assignments with activation controls match AB-650 identity governance expectations.',
          },
          {
            id: 'd10q4',
            prompt:
              'Which security product family is explicitly centered in AB-650 “Secure Microsoft 365 workloads” bullets?',
            choices: [
              'Microsoft Defender for Office 365',
              'Only Defender for Identity sensor tuning on DCs',
              'Only Defender for Cloud Apps Shadow IT discovery deep-dives',
              'Only Microsoft Endpoint Configuration Manager ADR rules',
            ],
            correctIndex: 0,
            explanation:
              'AB-650 lists Defender for Office 365 alerts, policies, investigation, and attack simulation.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/defender-office-365/mdo-about',
            sourceLabel: 'Defender for Office 365',
            studyContent:
              'Do not sink limited study time into full MS-102 XDR breadth. Be excellent at Defender for Office 365 collaboration threats.',
          },
          {
            id: 'd10q5',
            prompt:
              'DSPM for AI helps you:',
            choices: [
              'Monitor and secure AI activity / posture in Microsoft Purview',
              'Configure MX priority values',
              'Create Entra administrative units',
              'Replace Conditional Access',
            ],
            correctIndex: 0,
            explanation:
              'DSPM for AI is the Purview capability called out for AI activity monitoring/security.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/purview/dspm-for-ai',
            sourceLabel: 'DSPM for AI',
            studyContent:
              'Connect Purview classic controls (DLP/labels/retention requirements) to AI-specific posture with DSPM for AI.',
          },
          {
            id: 'd10q6',
            prompt:
              'An agent is pending approval before organization-wide use. Which control plane is most relevant?',
            choices: [
              'Agent registry review to publish or reject the agent',
              'Exchange inbox rules on a shared mailbox only',
              'Company branding logo upload only',
              'SSPR registration campaign only',
            ],
            correctIndex: 0,
            explanation:
              'Registry workflows include reviewing requests and publishing or rejecting agents.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
            sourceLabel: 'AB-650 agent registry objectives',
            studyContent:
              'Registry = inventory + approval + block/install controls for Microsoft, third-party, and custom agents.',
          },
          {
            id: 'd10q7',
            prompt:
              'Group-based licensing is preferred for large Copilot rollouts because:',
            choices: [
              'License assignment follows group membership with less manual per-user churn',
              'It disables the need for any Entra authentication',
              'It automatically remediates phishing emails',
              'It publishes agents without registry approval',
            ],
            correctIndex: 0,
            explanation:
              'AB-650 measures group-based licensing for Microsoft 365 and AI licenses.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/identity/users/licensing-groups-assign',
            sourceLabel: 'Assign licenses to a group',
            studyContent:
              'Operational pattern: security/M365 groups drive license assignment for Copilot and related AI SKUs at scale.',
          },
          {
            id: 'd10q8',
            prompt:
              'Conditional Access can protect agent access by:',
            choices: [
              'Applying policy conditions/controls to agent identities similar to other identities needing governance',
              'Rewriting SPF records automatically',
              'Detonating attachments in Safe Attachments',
              'Creating retention labels',
            ],
            correctIndex: 0,
            explanation:
              'Secure agent access including Conditional Access is explicitly measured.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview',
            sourceLabel: 'Conditional Access overview',
            studyContent:
              'Extend your CA mental model from humans to agents: who/what the agent is, which apps/resources, which grant controls.',
          },
          {
            id: 'd10q9',
            prompt:
              'Microsoft 365 Backup on AB-650 is about:',
            choices: [
              'Setup, restore, and monitor for operational recovery scenarios',
              'Replacing Defender threat policies',
              'Replacing sensitivity labels',
              'Only backing up on-premises file servers via SMB',
            ],
            correctIndex: 0,
            explanation:
              'Configure and use Microsoft 365 Backup including setup, restore, and monitor is a tenant skill.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365/backup/backup-overview',
            sourceLabel: 'Microsoft 365 Backup overview',
            studyContent:
              'Distinguish Backup (operational restore) from Purview retention (compliance) and from Defender (threats).',
          },
          {
            id: 'd10q10',
            prompt:
              'Web search management for Copilot controls grounding on:',
            choices: [
              'Public web content versus tenant-only grounding behaviors per admin configuration',
              'Only intranet DHCP scopes',
              'Only Windows Hello for Business PIN length',
              'Only Autopilot JSON profiles',
            ],
            correctIndex: 0,
            explanation:
              'Manage web search for Copilot and Copilot Chat is an enablement-domain skill.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365-copilot/manage-web-access',
            sourceLabel: 'Manage web access for Copilot',
            studyContent:
              'Expect scenario questions: restrict web grounding for a population vs leave it enabled for research scenarios.',
          },
          {
            id: 'd10q11',
            prompt:
              'Administrative units help you:',
            choices: [
              'Scope admin permissions to a subset of directory objects',
              'Create Safe Attachments policies',
              'Configure Copilot image generation toggles',
              'Host the agent registry exclusively',
            ],
            correctIndex: 0,
            explanation:
              'Create and manage administrative units is an Entra identity bullet on AB-650.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/administrative-units',
            sourceLabel: 'Administrative units',
            studyContent:
              'Delegation pattern for regional/divisional admins without Global Administrator sprawl.',
          },
          {
            id: 'd10q12',
            prompt:
              'Attack simulation training is part of:',
            choices: [
              'Defender for Office 365 security skills on AB-650',
              'SharePoint hub navigation design only',
              'Entra company branding only',
              'DNSSEC key rotation only',
            ],
            correctIndex: 0,
            explanation:
              'Configure and manage attack simulations, including training campaigns, is listed under Secure Microsoft 365 workloads.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/defender-office-365/attack-simulation-training-get-started',
            sourceLabel: 'Attack simulation training',
            studyContent:
              'Simulations measure susceptibility and drive training — governance of human risk for email threats.',
          },
          {
            id: 'd10q13',
            prompt:
              'Copilot connectors typically expand Copilot grounding by:',
            choices: [
              'Indexing external sources into Microsoft Graph with governed access',
              'Removing the need for user licenses',
              'Disabling Purview auditing',
              'Replacing PIM',
            ],
            correctIndex: 0,
            explanation:
              'Configure Copilot connectors is measured under Enable and manage Microsoft 365 Copilot.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-graph-connector',
            sourceLabel: 'Graph connectors overview',
            studyContent:
              'Connectors are extensibility + governance: what data is indexed, who can see it, how Copilot uses it.',
          },
          {
            id: 'd10q14',
            prompt:
              'Monitoring AI service health and adoption together is most associated with:',
            choices: [
              'Copilot Control System (plus admin center usage reports)',
              'Only Offline Domain Join blobs',
              'Only WSUS computer groups',
              'Only print server queues',
            ],
            correctIndex: 0,
            explanation:
              'AB-650 monitoring skills cite admin center Copilot usage reports and Copilot Control System usage/adoption/health.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/copilot/control-system/overview',
            sourceLabel: 'Copilot Control System',
            studyContent:
              'Operations layer for AI: are people using it, is it healthy, what does it cost, what must admins change.',
          },
          {
            id: 'd10q15',
            prompt:
              'Which topic should an MS-102 holder treat as net-new priority for AB-650?',
            choices: [
              'Agent identities, agent registry/Agent 365, Copilot admin governance, DSPM for AI, AI cost monitoring',
              'Only adding a second MX backup record',
              'Only classic public folder migration mechanics',
              'Only Skype for Business hybrid edge',
            ],
            correctIndex: 0,
            explanation:
              'Roughly 35–40% of AB-650 is AI services content that MS-102 did not measure the same way.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
            sourceLabel: 'AB-650 study guide — AI domain',
            studyContent:
              'Your MS-102 foundation covers much of identity/security/compliance refresh. Spend scarce hours on Copilot + agents + DSPM/cost — that is where AB-650 diverges.',
          },
          {
            id: 'd10q16',
            prompt:
              'Sensitivity labels vs DLP — which mapping is most accurate at requirements level?',
            choices: [
              'Labels classify/protect content; DLP detects/prevents sensitive data scenarios across locations (including Copilot where configured)',
              'Labels replace DNS; DLP replaces MFA',
              'Labels are only for guests; DLP is only for PIM',
              'Both are Defender Safe Attachments synonyms',
            ],
            correctIndex: 0,
            explanation:
              'AB-650 asks you to identify requirements for information protection and for DLP across Microsoft 365 and Copilot.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/purview/information-protection',
            sourceLabel: 'Microsoft Purview Information Protection',
            studyContent:
              'Exam language is often “which control meets the requirement?” — map classify/protect → labels; prevent exfiltration/use scenarios → DLP; keep/delete → retention.',
          },
          {
            id: 'd10q17',
            prompt:
              'Bulk identity operations at scale on AB-650 point you toward:',
            choices: [
              'Microsoft Graph PowerShell / Graph APIs',
              'Only manual GUI clicks one-by-one with no automation path',
              'Only Copilot Chat drafting emails',
              'Only attack simulation payloads',
            ],
            correctIndex: 0,
            explanation:
              'Perform bulk management, including Microsoft Graph PowerShell, is measured under Entra identities.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/powershell/microsoftgraph/overview',
            sourceLabel: 'Microsoft Graph PowerShell',
            studyContent:
              'You do not need to memorize every cmdlet — know Graph PowerShell is the toolclass for bulk user/group operations.',
          },
          {
            id: 'd10q18',
            prompt:
              'Managing agent owners matters because:',
            choices: [
              'Ownership/accountability is part of agent lifecycle and governance when agents access organizational data',
              'Owners only exist for SharePoint hub sites',
              'Owners replace the need for licenses',
              'Owners disable Conditional Access automatically',
            ],
            correctIndex: 0,
            explanation:
              'Manage agent owners is an explicit Implement and manage agents skill.',
            sourceUrl:
              'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-650',
            sourceLabel: 'AB-650 — manage agent owners',
            studyContent:
              'Unowned agents are a governance failure mode. Know owner responsibilities and what happens when ownership must transfer.',
          },
        ],
      },
    ],
  },
]

export function getAllModules() {
  return curriculum.flatMap((day) =>
    day.modules.map((module) => ({ day, module })),
  )
}

export function findDay(dayId: string) {
  return curriculum.find((d) => d.id === dayId)
}

export function findModule(moduleId: string) {
  for (const day of curriculum) {
    const module = day.modules.find((m) => m.id === moduleId)
    if (module) return { day, module }
  }
  return undefined
}

export function totalModuleCount() {
  return getAllModules().length
}
