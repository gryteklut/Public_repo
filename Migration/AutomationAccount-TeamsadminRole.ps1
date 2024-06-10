#"AppId eq '48ac35b8-9aa8-4d74-927d-1f4a14a0b239'"  = Teams app. Can be reused for other apps.
#
Connect-MgGraph -Scopes “Application.Read.All”,”AppRoleAssignment.ReadWrite.All,RoleManagement.ReadWrite.Directory”
Select-MgProfile Beta
$aacount = "" #Automation account
# Fetch details of the Teams management app
$TeamsApp = Get-MgServicePrincipal -Filter "AppId eq '48ac35b8-9aa8-4d74-927d-1f4a14a0b239'" 
$AppPermission = $TeamsApp.AppRoles | Where-Object {$_.DisplayName -eq "Application_access"} # Create the payload for the assignment
$ManagedIdentityApp = Get-MgServicePrincipal -Filter "displayName eq $aacount"
$AppRoleAssignment = @{
"PrincipalId" = $ManagedIdentityApp.Id
"ResourceId" = $TeamsApp.Id
"AppRoleId" = $AppPermission.Id }
# Assign the role to the service principal for the managed identity.
New-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $ManagedIdentityApp.Id -BodyParameter $AppRoleAssignment
