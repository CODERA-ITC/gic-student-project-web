<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-b border-blue-700/30 dark:border-slate-700">
      <UContainer>
        <div class="flex items-center gap-4 mb-4">
          <div
            class="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-1 hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
            <ButtonsPresetButton preset="back" @click="goBack" class="!text-white" />
          </div>
        </div>
        <div class="space-y-2">
          <h1 class="text-4xl font-black text-white">Profile Settings</h1>
          <p class="text-blue-100 dark:text-slate-300">
            Manage your account and preferences
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 space-y-1 sticky top-20">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
              activeTab === tab.id
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700',
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
            ]">
              <UIcon :name="tab.icon" class="w-5 h-5" />
              <span class="font-medium">{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
            <!-- Profile Information -->
            <ProfileInformation v-if="activeTab === 'profile'" :initial-data="authStore.user"
              @save="handleProfileSave" />

            <!-- Public Profile Preview -->
            <template v-if="authStore.isStudent">
              <ProfilePublicProfilePreview v-if="activeTab === 'public'" :user="authStore.user"
                :bio="StudentProfile.bio" :skills="StudentProfile.skills" :social-links="StudentProfile.socialLinks"
                :program="StudentProfile.program" :year="StudentProfile.year" :phone="StudentProfile.phone"
                :student-id="StudentProfile.studentId" :project-count="StudentProfile.projectCount"
                :achievements="StudentProfile.achievements" />
            </template>

            <!-- Account Settings -->
            <ProfileAccountSettings v-if="activeTab === 'account'" @update-password="handlePasswordUpdate"
              @toggle-2fa="handleToggle2FA" @revoke-session="handleRevokeSession" />

            <!-- Notifications -->
            <ProfileNotificationSettings v-if="activeTab === 'notifications'" @save="handleNotificationsSave" />

            <!-- Privacy -->
            <ProfilePrivacySettings v-if="activeTab === 'privacy'" @save="handlePrivacySave"
              @data-request="handleDataRequest" @delete-account="handleDeleteAccount" />
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import auth from "~/middleware/auth";
import { useAuthStore, type User } from "~/stores/auth";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const authStore = useAuthStore();
const activeTab = ref("profile");
const isLoading = ref(false);

const goBack = () => {
  // Navigate back to role-specific dashboard
  if (authStore.isStudent) {
    router.push("/student/dashboard");
  } else if (authStore.isTeacher) {
    router.push("/teacher/dashboard");
  } else {
    router.push("/");
  }
};

const tabs = computed(() => {
  const allTabs = [
    { id: "profile", label: "Profile", icon: "i-heroicons-user" },
    { id: "public", label: "Public Profile", icon: "i-heroicons-eye" },
    { id: "account", label: "Account", icon: "i-heroicons-lock-closed" },
    { id: "notifications", label: "Notifications", icon: "i-heroicons-bell" },
    { id: "privacy", label: "Privacy", icon: "i-heroicons-shield-check" },
  ];

  // Filter out public profile tab if not a student
  if (!authStore.isStudent) {
    return allTabs.filter((tab) => tab.id !== "public");
  }

  return allTabs;
});

// Profile data that can be edited and reflected in the public profile
const StudentProfile = reactive({
  bio: "",
  skills: [] as string[],
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  },
  program: "",
  year: "",
  phone: "",
  studentId: "",
  gen: "",
  projectCount: 0,
  achievements: 0,
});

// Teacher profile data
const TeacherProfile = reactive({
  bio: "",
  skills: [] as string[],
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  },
  department: "",
  position: "",
  phone: "",
  teacherId: "",
  courses: [] as string[],
  yearsOfExperience: 0,
});

const AdminProfile = reactive({
  bio: "",
  skills: [] as string[],
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  },
  adminId: "",
});

// Fetch profile data on component mount
onMounted(async () => {
  isLoading.value = true;
  try {
    // TODO: Replace with actual API endpoint
    const userId = authStore.currentUser?.id;
    const role = authStore.userRole;

    if (authStore.isStudent) {
      // Fetch student profile
      // const response = await $fetch(`/api/students/${userId}/profile`);
      // For now, using mock data
      const studentUser = authStore.studentProfile;
      Object.assign(StudentProfile, {
        bio:
          studentUser?.bio ||
          "Passionate student at GIC, working on exciting projects and learning new technologies.",
        skills: studentUser?.skills || [
          "JavaScript",
          "TypeScript",
          "Vue.js",
          "Node.js",
          "Python",
        ],
        program: studentUser?.program || "Computer Science",
        year: studentUser?.year || "4th Year",
        studentId: studentUser?.studentId || "e2021XXXX",
        gen: studentUser?.gen || "25",
        phone: studentUser?.phone || "",
        socialLinks: studentUser?.socialLinks || {
          github: "",
          linkedin: "",
          twitter: "",
          portfolio: "",
        },
        projectCount: studentUser?.projectCount || 0,
        achievements: studentUser?.achievements || 0,
      });
    } else if (authStore.isTeacher) {
      // Fetch teacher profile
      // const response = await $fetch(`/api/teachers/${userId}/profile`);
      // For now, using mock data
      const teacherUser = authStore.teacherProfile;
      Object.assign(TeacherProfile, {
        bio:
          teacherUser?.bio ||
          "Experienced educator at GIC, passionate about teaching and mentoring students.",
        skills: teacherUser?.skills || [
          "Teaching",
          "Curriculum Development",
          "JavaScript",
          "Python",
        ],
        department: teacherUser?.department || "Computer Science",
        position: teacherUser?.position || "Associate Professor",
        teacherId: teacherUser?.teacherId || "T2021XXXX",
        phone: teacherUser?.phone || "",
        courses: teacherUser?.courses || [
          "Web Development",
          "Database Systems",
          "Software Engineering",
        ],
        yearsOfExperience: teacherUser?.yearsOfExperience || 5,
        socialLinks: teacherUser?.socialLinks || {
          github: "",
          linkedin: "",
          twitter: "",
          portfolio: "",
        },
      });
    } else if (authStore.isAdmin) {
      // Fetch admin profile
      // const response = await $fetch(`/api/admins/${userId}/profile`);
      // For now, using mock data
      const adminUser = authStore.adminProfile;
      Object.assign(AdminProfile, {
        bio:
          adminUser?.bio ||
          "Administrator at GIC, managing the platform and ensuring smooth operations.",
        skills: adminUser?.skills || [
          "Management",
          "Security",
          "Communication",
        ],
        adminId: adminUser?.adminId || "A2021XXXX",
        socialLinks: adminUser?.socialLinks || {
          github: "",
          linkedin: "",
          twitter: "",
          portfolio: "",
        },
      });
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
  } finally {
    isLoading.value = false;
  }
});

// Computed property to get the appropriate profile data based on role
const currentProfile = computed(() => {
  if (authStore.isStudent) return StudentProfile;
  if (authStore.isTeacher) return TeacherProfile;
  return AdminProfile;
});

// Event handlers
const handleProfileSave = (data: any) => {
  console.log("Profile saved:", data);

  if (authStore.isStudent) {
    // Update student profile data
    if (data.bio) StudentProfile.bio = data.bio;
    if (data.skills) StudentProfile.skills = data.skills;
    if (data.program) StudentProfile.program = data.program;
    if (data.year) StudentProfile.year = data.year;
    if (data.phone) StudentProfile.phone = data.phone;
    if (data.studentId) StudentProfile.studentId = data.studentId;
    if (data.socialLinks) {
      StudentProfile.socialLinks = {
        ...StudentProfile.socialLinks,
        ...data.socialLinks,
      };
    }
  } else if (authStore.isTeacher) {
    // Update teacher profile data
    if (data.bio) TeacherProfile.bio = data.bio;
    if (data.skills) TeacherProfile.skills = data.skills;
    if (data.department) TeacherProfile.department = data.department;
    if (data.position) TeacherProfile.position = data.position;
    if (data.phone) TeacherProfile.phone = data.phone;
    if (data.teacherId) TeacherProfile.teacherId = data.teacherId;
    if (data.courses) TeacherProfile.courses = data.courses;
    if (data.yearsOfExperience)
      TeacherProfile.yearsOfExperience = data.yearsOfExperience;
    if (data.socialLinks) {
      TeacherProfile.socialLinks = {
        ...TeacherProfile.socialLinks,
        ...data.socialLinks,
      };
    }
  } else if (authStore.isAdmin) {
    // Update admin profile data
    if (data.bio) AdminProfile.bio = data.bio;
    if (data.skills) AdminProfile.skills = data.skills;
    if (data.adminId) AdminProfile.adminId = data.adminId;
    if (data.socialLinks) {
      AdminProfile.socialLinks = {
        ...AdminProfile.socialLinks,
        ...data.socialLinks,
      };
    }
  }
  // TODO: Implement API call
};

const handlePasswordUpdate = async (data: any) => {
  try {
    const token = authStore.token;
    
    console.log("=== Password Change Debug ===");
    console.log("Token exists:", !!token);
    console.log("Token length:", token?.length);
    console.log("User:", authStore.user?.email);
    console.log("Request data:", data);
    
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const apiBaseUrl = useRuntimeConfig().public.apiBase;
    const url = `${apiBaseUrl}/users/change-password`;
    
    console.log("API URL:", url);
    console.log("Authorization header:", `Bearer ${token.substring(0, 20)}...`);

    // Call API to change password
    const response = await $fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: {
        answers: data.answers,
        newPassword: data.newPassword,
      },
    });

    console.log("Password changed successfully:", response);
    // TODO: Show success toast
    return response;
  } catch (error: any) {
    console.error("Password change error:", error);
    console.error("Error status:", error?.statusCode);
    console.error("Error data:", error?.data);
    
    let errorMessage = "Failed to change password";
    
    if (error?.statusCode === 401) {
      errorMessage = "Unauthorized. Your session may have expired. Please log in again.";
    } else {
      errorMessage = error?.data?.message || error?.message || errorMessage;
    }
    
    // TODO: Show error toast
    throw new Error(errorMessage);
  }
};

const handleToggle2FA = (enabled: boolean) => {
  console.log("2FA toggled:", enabled);
  // TODO: Implement API call
};

const handleRevokeSession = (sessionId: number) => {
  console.log("Session revoked:", sessionId);
  // TODO: Implement API call
};

const handleNotificationsSave = (data: any) => {
  console.log("Notifications saved:", data);
  // TODO: Implement API call
};

const handlePrivacySave = (data: any) => {
  console.log("Privacy settings saved:", data);
  // TODO: Implement API call
};

const handleDataRequest = () => {
  console.log("Data request initiated");
  // TODO: Implement data export
};

const handleDeleteAccount = () => {
  console.log("Account deletion requested");
  // TODO: Implement account deletion with confirmation
};

useHead({
  title: "Profile Settings - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Manage your profile and account settings",
    },
  ],
});
</script>
