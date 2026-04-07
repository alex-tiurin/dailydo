package {{testsPath}}
import {{activityFullName}}
import ai.assertum.recorderclient.annotation.RecorderTest
import ai.assertum.recorderclient.runRecorderClient
import com.atiurin.ultron.core.compose.config.UltronComposeConfig
import com.atiurin.ultron.core.compose.createUltronComposeRule
import org.junit.BeforeClass
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import java.util.concurrent.TimeUnit

class {{recorderTestClassName}} {
    @get:Rule
    val composeRule = createUltronComposeRule<{{activityClassName}}>()

    @Test
    @RecorderTest
    fun startServerTest() {
        runRecorderClient()
        while (!Thread.currentThread().isInterrupted) {
            TimeUnit.SECONDS.sleep(1)
        }
    }

    companion object {
        @JvmStatic
        @BeforeClass
        fun configUltron() {
            UltronComposeConfig.applyRecommended()
        }
    }
}