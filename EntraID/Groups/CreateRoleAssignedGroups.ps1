param (
    [string]$JsonFilePath = "C:\PIMgroupExample.json" # Path to the JSON file
)

# Connect to Microsoft Graph with the required scopes
Connect-MgGraph -Scopes "RoleManagement.ReadWrite.Directory, Directory.ReadWrite.All, Group.ReadWrite.All"

# Read the JSON file
$groups = Get-Content -Path $JsonFilePath | ConvertFrom-Json

foreach ($group in $groups) {
    $groupName = $group.GroupName
    $roleNames = $group.RoleNames

    # Create the security group
    $newgroup = New-MgGroup -DisplayName $groupName -MailEnabled:$false -MailNickname "dummyname" -SecurityEnabled -IsAssignableToRole:$true

    if ($null -eq $newGroup) {
        Write-Error "Failed to create group '$groupName'."
        continue
    }

    Write-Output "Created group '$groupName' with ID: $($newGroup.Id)"

    # Retrieve all roles
    $roles = Get-MgRoleManagementDirectoryRoleDefinition

    # Filter roles based on the specified role names
    $selectedRoles = $roles | Where-Object { $roleNames -contains $_.DisplayName }
    if ($selectedRoles.Count -eq 0) {
        Write-Error "No matching roles found for group '$groupName'."
        continue
    }

    # Assign the selected roles to the group
    foreach ($role in $selectedRoles) {
        $assignment = @{
            PrincipalId = $newGroup.Id
            RoleDefinitionId = $role.Id
            DirectoryScopeId = "/"
        }

        try {
            New-MgRoleManagementDirectoryRoleAssignment -BodyParameter $assignment
            Write-Output "Assigned role '$($role.DisplayName)' to group '$groupName'."
        } catch {
            Write-Error "Failed to assign role '$($role.DisplayName)' to group '$groupName'."
        }
    }
}
