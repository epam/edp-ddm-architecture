import com.epam.edp.stages.impl.ci.ProjectType
import com.epam.edp.stages.impl.ci.Stage

@Stage(name = "compile", buildTool = "npm", type = [ProjectType.APPLICATION, ProjectType.LIBRARY])
class DocumentCompile {
    Script script

    void run(context) {
        script.dir("${context.workDir}") {
            script.withCredentials([
                script.usernamePassword(credentialsId: "${context.nexus.credentialsId}", passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME'),
                script.usernamePassword(credentialsId: 'gerrit-ciuser-password', passwordVariable: 'gitPassword', usernameVariable: 'gitUsername')
                ]) {
                def token = script.sh(script: """
        curl -s -H "Accept: application/json" -H "Content-Type:application/json" -X PUT --data \
        '{"name": "${script.USERNAME}", "password": "${script.PASSWORD}"}' \
        ${context.buildTool.groupRepository}-/user/org.couchdb.user:${script.USERNAME} | \
        grep -oE 'NpmToken\\.[0-9a-zA-Z-]+'
        """,
                        returnStdout: true)
            
            script.sh(script: """
            set +x
            npm set registry ${context.buildTool.groupRepository}
            """)

            script.sh "export GIT_CREDENTIALS='https://${script.gitUsername}:${script.gitPassword}@gerrit-mdtu-ddm-edp-cicd.apps.cicd2.mdtu-ddm.projects.epam.com' && npm install"
            }
        }
    }
}
return DocumentCompile