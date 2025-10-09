Privileged Identity Management (PIM)
===========================================


1 Background
------------

**Crayon**, has configured a starting point for the setup of Privileged Identity Management (PIM).

* * *

2 Solution Design
-----------------

The PIM design consists of **dedicated groups in Entra ID** that are granted access to **privileged roles** in Entra ID.

*   A group can provide access to one or more roles, and a role can be accessed by one or more groups6.
    
*   The entire concept is built on a user always being **"eligible"** to become a member of a group, and the group having **"active"** assignments of one or more roles.


![image.png](/.attachments/image-feb94f4d-58f0-405d-8985-15a3ce317c23.png)

### Eligible vs. Active

The design relies on two key concepts:
| Concept | Description | Security Implication |
| --- | --- | --- |
| **Eligible** | You have the _possibility_ to get specific permissions or roles, but you must take an extra step to **activate** them when needed. This means access to specific resources is only available when necessary, requiring a deliberate action to activate it.<br><br><br> | Reduces the risk of unintentional or malicious access. It is desirable to use "eligible" as much as possible for security reasons.<br><br><br> |
| **Active** | You _already have_ these permissions or roles and can use them immediately without further action.<br><br><br> | From a security perspective, it's often undesirable to have such permissions active by default, as this increases the risk of a security breach.<br><br><br> |

### 2.1 PIM Groups

A **PIM group** in Microsoft Entra ID is a dedicated group that can be assigned roles with special permissions to manage access to sensitive resources14.

*   This group enables **just-in-time** access, meaning members only activate their roles when necessary and for a limited period. This reduces the risk of privileged misuse and strengthens security by ensuring critical permissions are only available when needed16.
    
*   Groups have **fixed assignments** of one or more roles ("active").
    
*   Accounts that should have access are **"eligible"** to become members for a limited period and thus receive the roles with the membership.
    
*   A major advantage of using groups is the ability to set different rules and access based on factors like **internal and external accounts**.
    

### 2.2 User Accounts

Using **dedicated user accounts** for PIM is essential for maintaining a high security standard.

*   Separating administrative rights from daily use reduces the risk of accidental or malicious actions that could compromise system security.
    
*   Dedicated accounts are only used when higher privileges are needed, keeping the administrative accounts **inactive** during normal work conditions.
    
*   The downside of using the same account for daily work and administrative tasks is the continuous access to higher rights, which increases the risk of error or unauthorized use. If a daily account is compromised, an attacker gains direct access to critical systems and data.
    
*   Therefore, using dedicated user accounts for PIM is more secure to ensure higher rights are used only when necessary, minimizing potential security risks.
    

### 2.3 General Rules Behind the Design

*   **Break-glass accounts** never use PIM.
    
*   The roles **"Global Administrator"** and **"Privileged Role Administrator"** are assigned to unique groups and are never included in a collection with other roles.
    
*   The goal is for **ALL assignments** to groups to be set as **"eligible"** and not "active". This means users must activate membership in the group for the role to take effect.
    
*   Ideally, all assignments are **time-limited** so they have an expiration date. This includes accounts for internal employees.
    
*   This time limit can be set to a maximum of **1 year** at a time. This is to prevent old accesses from remaining and posing a future security risk.
    

* * *

3 Setup
-------

Setting up and changing PIM configuration requires the roles **"Privileged Role Administrator"** or **"Global Administrator"**.

### 3.1 PIM Groups

#### 3.1.1 Naming Standard

The naming standard for PIM groups is **`%company% - pim - role`**.
    
*   The description can describe single roles or a collection of roles for a function38.
    
*   **Examples:**
    *   `%company%-pim-global admin` is for  grants access to the Global Administrator role
        
    *   `%company%-pim-helpdesk` is for internal accounts and grants access to multiple roles for staffing the IT helpdesk. The roles can be listed in the group's description. This means the end-user only needs one elevation in total, not one for each role.
     
***
4 Configuration
----
  
*   Assignment is eligible for 1 year

### Role Activation and MFA Requirements
* All roles require phish resistant MFA
* Most privileged roles can be active for 2 hours, regular roles can be active up to 4 hours.

| GroupName | RoleNames |
| :--- | :--- |
| Spir-Group-Global-pim-global-admin | Global Administrator |
| Spir-Group-Global-pim-global-reader | Global Reader |
| Spir-Group-Global-pim-privileged-role-admin | Privileged Role Administrator |
| Spir-Group-Global-pim-application-admin | Application Administrator |
| Spir-Group-Global-pim-helpdesk | User Administrator, Helpdesk Administrator, Authentication Administrator, License Administrator, Group Administrator |
| Spir-Group-Global-pim-hybrid-identity-admin | hybrid Identity Administrator |
| Spir-Group-Global-pim-office-admin | SharePoint Administrator, Teams Administrator, Exchange Administrator |
| Spir-Group-Global-pim-intune-admin | Intune Administrator |
| Spir-Group-Global-pim-security-admin | Security Administrator |
| Spir-Group-Global-pim-iam-admin | Identity Governance Administrator, Conditional Access Administrator, User Administrator |
