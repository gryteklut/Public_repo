#Get-Module -Name Microsoft.Entra -ListAvailable
#Install-Module -Name Microsoft.Entra -Repository PSGallery -Scope CurrentUser -Force -AllowClobber
#Connect-Entra -Scopes 'Directory.AccessAsUser.All'

$groupid = "9a01c262-c222-4bc9-b729-e29dd3722a72" #ObjectID of the group

$users = Get-MgGroupMember -GroupId $groupId
foreach ($user in $users) {
    $user = get-mguser -UserId $user.id
    $userupn = $user.userPrincipalName
    write-host $userupn

    #Create a new password
    Add-Type -AssemblyName 'System.Web'
    $NewPassword = [System.Web.Security.Membership]::GeneratePassword(24, 3)

    #Write-Host $NewPassword #Uncomment to view new password


    # Create the password profile with the generated password
    $passwordprofile = @{
        Password = $NewPassword
        forceChangePasswordNextSignIn = $False
        forceChangePasswordNextSignInWithMfa = $False
    }
    # Set the user's password using MgUser
    Update-MgUser -UserId $userupn -PasswordProfile $passwordprofile
}
