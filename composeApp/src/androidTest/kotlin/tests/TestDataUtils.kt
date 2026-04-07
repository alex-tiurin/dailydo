package tests

import java.util.UUID
import kotlin.random.Random

/**
 * Central place for e2e test data — avoids hard-coded strings and name collisions.
 */
object TestDataUtils {

    private val random = Random.Default

    /**
     * Unique list name for a run (parallel-safe vs fixed literals).
     * @param prefix human-readable label, e.g. test case id
     */
    fun uniqueListName(prefix: String = "TC"): String =
        "$prefix ${System.currentTimeMillis()}-${random.nextInt(0x10000)}"

    /**
     * Random single-line task title (unique per call).
     */
    fun randomTaskText(prefix: String = "task"): String =
        "$prefix-${UUID.randomUUID().toString().replace("-", "").take(12)}"

    /**
     * Text for the first task line on create screen (alias with a conventional prefix).
     */
    fun randomFirstTaskText(): String = randomTaskText("task")

    /**
     * Two distinct task strings for multi-task scenarios (e.g. TC-T-01).
     */
    fun twoRandomTaskTexts(
        firstPrefix: String = "TC-T-task-a",
        secondPrefix: String = "TC-T-task-b",
    ): Pair<String, String> =
        randomTaskText(firstPrefix) to randomTaskText(secondPrefix)
}
