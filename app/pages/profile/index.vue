<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div class="py-14">
      <UContainer>
        <div class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/15
                 bg-white/90 dark:bg-slate-900/90 shadow-2xl px-8 py-10">
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(79,70,229,0.08),transparent_30%)] pointer-events-none"
            aria-hidden="true"></div>

          <div class="relative space-y-3">
            <div class="flex flex-col gap-3 mb-2">
              <nav class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300">
                <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.label">
                  <NuxtLink :to="crumb.to || undefined" :class="[
                    'transition-colors',
                    crumb.to
                      ? 'hover:text-blue-600 dark:hover:text-blue-300'
                      : 'text-slate-900 dark:text-white font-semibold',
                  ]">
                    {{ crumb.label }}
                  </NuxtLink>
                  <span v-if="idx < breadcrumbs.length - 1" class="text-slate-400 dark:text-slate-500">/</span>
                </template>
              </nav>
              <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Profile Settings
              </h1>
            </div>
            <p class="text-slate-700 dark:text-slate-300">
              Manage your account and preferences
            </p>
          </div>
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
import { useAuthStore, type User } from "~/stores/auth";
import type { UpdateProfilePayload } from "~/types/user-profile";

const breadcrumbs = [
  { label: "Dashboard", to: "/student/dashboard" },
  { label: "Profile Settings" },
];

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
const profileEquals = (payload: UpdateProfilePayload, current: User | null) => {
  if (!current) return false;

  // Normalize comparable subset
  const normalize = (d: any) =>
    JSON.stringify({
      name: d.name ?? current.name,
      bio: d.bio ?? current.bio,
      phone: d.phone ?? current.phone,
      avatar: d.avatar ?? current.avatar,
      skills: d.skills ?? (current as any).skills,
      socialLinks: d.socialLinks ?? (current as any).socialLinks,
      // student
      studentId: d.studentId ?? (current as any).studentId,
      program: d.program ?? (current as any).program ?? (current as any).department,
      year: d.year ?? (current as any).year,
      gen: d.gen ?? (current as any).gen,
      // teacher
      teacherId: d.teacherId ?? (current as any).teacherId,
      department: d.department ?? (current as any).department,
      position: d.position ?? (current as any).position,
      courses: d.courses ?? (current as any).courses,
      yearsOfExperience:
        d.yearsOfExperience ?? (current as any).yearsOfExperience,
      // admin
      adminId: d.adminId ?? (current as any).adminId,
    });

  return normalize(payload) === normalize({});
};

const handleProfileSave = async (data: UpdateProfilePayload) => {
  console.log("Profile saved:", data);

  try {
    if (profileEquals(data, authStore.currentUser)) {
      console.log("No profile changes detected; skipping update.");
      return;
    }

    await authStore.updateUserProfile(data);

    // After successful save, refetch user data from server to ensure consistency
    await authStore.fetchCurrentUser();

    // Helper to map array of social link items back to object shape for form binding
    const toSocialObj = (links: any[] | undefined) =>
      (links || []).reduce(
        (acc, item) => {
          if (item?.name && item?.url) acc[item.name] = item.url;
          return acc;
        },
        { github: "", linkedin: "", twitter: "", portfolio: "" } as Record<string, string>,
      );

    const syncProfileFromStore = () => {
      if (authStore.isStudent) {
        const user = authStore.studentProfile;
        Object.assign(StudentProfile, {
          bio: user?.bio || "",
          skills: user?.skills || [],
          program: user?.program || "",
          year: user?.year || "",
          studentId: user?.studentId || "",
          gen: user?.gen || "",
          phone: user?.phone || "",
          socialLinks: toSocialObj((user as any)?.socialLinks),
          projectCount: user?.projectCount || 0,
          achievements: user?.achievements || 0,
        });
      } else if (authStore.isTeacher) {
        const user = authStore.teacherProfile;
        Object.assign(TeacherProfile, {
          bio: user?.bio || "",
          skills: user?.skills || [],
          department: user?.department || "",
          position: user?.position || "",
          teacherId: user?.teacherId || "",
          phone: user?.phone || "",
          courses: user?.courses || [],
          yearsOfExperience: user?.yearsOfExperience || 0,
          socialLinks: toSocialObj((user as any)?.socialLinks),
        });
      } else if (authStore.isAdmin) {
        const user = authStore.adminProfile;
        Object.assign(AdminProfile, {
          bio: user?.bio || "",
          skills: user?.skills || [],
          adminId: user?.adminId || "",
          socialLinks: toSocialObj((user as any)?.socialLinks),
        });
      }
    };

    // Update local reactive state with fresh data from store
    syncProfileFromStore();

    console.log("✅ Profile updated and store refreshed");
  } catch (error) {
    console.error("❌ Failed to update profile:", error);
    throw error;
  }
};

const handlePasswordUpdate = async (data: any) => {
  try {
    const response = await authStore.changePassword({
      answers: data.answers,
      newPassword: data.newPassword,
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
      errorMessage =
        "Unauthorized. Your session may have expired. Please log in again.";
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
  title: "Profile Settings - GIC Showcase",
  meta: [
    {
      name: "description",
      content: "Manage your profile and account settings",
    },
  ],
});
</script>
