import retrofit2.Call
import retrofit2.http.*

interface ApiService {

    @POST("api/moods")
    fun saveMood(@Body mood: MoodEntry): Call<MoodEntry>

    @GET("api/moods/{userId}")
    fun getMoods(@Path("userId") userId: Long): Call<List<MoodEntry>>

    @POST("api/medications")
    fun saveMedication(@Body medication: Medication): Call<Medication>

    @GET("api/medications/{userId}")
    fun getMedications(@Path("userId") userId: Long): Call<List<Medication>>

    @POST("api/appointments")
    fun saveAppointment(@Body appointment: Appointment): Call<Appointment>

    @GET("api/appointments/{userId}")
    fun getAppointments(@Path("userId") userId: Long): Call<List<Appointment>>

    @POST("api/grief")
    fun saveGriefEntry(@Body griefEntry: GriefEntry): Call<GriefEntry>

    @GET("api/grief/{userId}")
    fun getGriefEntries(@Path("userId") userId: Long): Call<List<GriefEntry>>
}