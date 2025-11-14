<template>
  <div class="min-h-screen bg-slate-900 py-12">
    <UContainer>
      <!-- Back Button -->
      <div class="mb-8">
        <ButtonsPresetButton
          preset="back"
          to="/projects"
          @click="mobileMenuOpen = false"
        />
      </div>

      <!-- Header -->
      <div class="max-w-3xl mx-auto mb-12">
        <h1 class="text-5xl font-black text-white mb-2">Create New Project</h1>
        <p class="text-xl text-gray-300">
          Share your amazing project with the GIC community
        </p>
      </div>

      <!-- Form Card -->
      <div
        class="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-8"
      >
        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- Step Indicator -->
          <div class="flex justify-between mb-12">
            <div
              v-for="(step, idx) in steps"
              :key="step.id"
              class="flex items-center flex-1"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                  currentStep > idx
                    ? 'bg-green-600 text-white'
                    : currentStep === idx
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : 'bg-slate-700 text-gray-400',
                ]"
              >
                {{ idx + 1 }}
              </div>
              <div
                v-if="idx < steps.length - 1"
                :class="[
                  'flex-1 h-1 mx-2 rounded-full transition-all',
                  currentStep > idx ? 'bg-green-600' : 'bg-slate-700',
                ]"
              ></div>
            </div>
          </div>

          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 0" class="space-y-6 animate-fadeIn">
            <h2 class="text-2xl font-bold text-white">Basic Information</h2>

            <!-- Project Title -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-2">
                Project Title *
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Enter a descriptive project title"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
              <p class="text-xs text-gray-400 mt-1">Maximum 100 characters</p>
            </div>

            <!-- Project Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-2">
                Description *
              </label>
              <textarea
                v-model="form.description"
                placeholder="Describe your project in detail. What does it do? Why is it important?"
                rows="5"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                required
              ></textarea>
              <p class="text-xs text-gray-400 mt-1">
                {{ form.description.length }}/500 characters
              </p>
            </div>

            <!-- Project Emoji -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-2">
                Project Icon (Emoji) *
              </label>
              <div class="grid grid-cols-6 gap-2">
                <button
                  v-for="emoji in [
                    '🤖',
                    '💪',
                    '🛍️',
                    '🌍',
                    '🧠',
                    '📊',
                    '🎮',
                    '🎨',
                    '🔐',
                    '📱',
                    '🚀',
                    '⚡',
                  ]"
                  :key="emoji"
                  type="button"
                  @click="form.emoji = emoji"
                  :class="[
                    'w-full aspect-square rounded-lg font-bold text-2xl border-2 transition-all',
                    form.emoji === emoji
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 hover:border-slate-500',
                  ]"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>

            <!-- Two Column Layout -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Category -->
              <div>
                <label class="block text-sm font-semibold text-gray-200 mb-2">
                  Category *
                </label>
                <select
                  v-model="form.category"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Web">Web</option>
                  <option value="IoT">IoT</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Sustainability">Sustainability</option>
                </select>
              </div>

              <!-- Semester -->
              <div>
                <label class="block text-sm font-semibold text-gray-200 mb-2">
                  Semester *
                </label>
                <select
                  v-model="form.semester"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Select semester</option>
                  <option value="Semester 1, 2024">Semester 1, 2024</option>
                  <option value="Semester 2, 2024">Semester 2, 2024</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 2: Technical Details -->
          <div v-if="currentStep === 1" class="space-y-6 animate-fadeIn">
            <h2 class="text-2xl font-bold text-white">Technical Details</h2>

            <!-- Technologies -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-3">
                Technologies Used *
              </label>
              <div class="space-y-3">
                <div class="flex gap-2">
                  <input
                    v-model="techInput"
                    type="text"
                    placeholder="e.g., React, Node.js, MongoDB..."
                    class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    @keyup.enter="addTechnology"
                  />
                  <UButton
                    type="button"
                    @click="addTechnology"
                    color="primary"
                    icon="i-heroicons-plus"
                  />
                </div>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="(tech, idx) in form.technologies"
                    :key="idx"
                    color="primary"
                    class="cursor-pointer hover:opacity-80"
                    @click="form.technologies.splice(idx, 1)"
                  >
                    {{ tech }}
                    <UIcon name="i-heroicons-x-mark" class="w-4 h-4 ml-1" />
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- GitHub URL -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-2">
                GitHub Repository URL
              </label>
              <input
                v-model="form.githubUrl"
                type="url"
                placeholder="https://github.com/username/project"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <!-- Demo URL -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-2">
                Live Demo URL
              </label>
              <input
                v-model="form.demoUrl"
                type="url"
                placeholder="https://your-project-demo.com"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <!-- Repository Visibility -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-3">
                Repository Visibility
              </label>
              <div class="flex gap-4">
                <label
                  v-for="visibility in ['public', 'private']"
                  :key="visibility"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    :value="visibility"
                    v-model="form.visibility"
                    class="w-4 h-4 text-blue-600"
                  />
                  <span class="text-white capitalize">{{ visibility }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Step 3: Project Details -->
          <div v-if="currentStep === 2" class="space-y-6 animate-fadeIn">
            <h2 class="text-2xl font-bold text-white">Project Details</h2>

            <!-- Duration -->
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-200 mb-2">
                  Project Duration
                </label>
                <input
                  v-model="form.duration"
                  type="text"
                  placeholder="e.g., 3 months"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-200 mb-2">
                  Team Size
                </label>
                <input
                  v-model.number="form.teamSize"
                  type="number"
                  min="1"
                  max="20"
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <!-- Team Members -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-3">
                Team Members
              </label>
              <div class="space-y-3">
                <div class="flex gap-2">
                  <input
                    v-model="memberInput"
                    type="text"
                    placeholder="Enter team member name"
                    class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    @keyup.enter="addTeamMember"
                  />
                  <UButton
                    type="button"
                    @click="addTeamMember"
                    color="primary"
                    icon="i-heroicons-plus"
                  />
                </div>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="(member, idx) in form.teamMembers"
                    :key="idx"
                    color="info"
                    class="cursor-pointer hover:opacity-80"
                    @click="form.teamMembers.splice(idx, 1)"
                  >
                    {{ member }}
                    <UIcon name="i-heroicons-x-mark" class="w-4 h-4 ml-1" />
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Roadmap -->
            <div>
              <label class="block text-sm font-semibold text-gray-200 mb-3">
                Project Roadmap (Phases)
              </label>
              <div class="space-y-3">
                <div class="flex gap-2">
                  <input
                    v-model="roadmapInput"
                    type="text"
                    placeholder="e.g., Phase 1: MVP Development"
                    class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    @keyup.enter="addRoadmapPhase"
                  />
                  <UButton
                    type="button"
                    @click="addRoadmapPhase"
                    color="primary"
                    icon="i-heroicons-plus"
                  />
                </div>
                <div class="space-y-2">
                  <div
                    v-for="(phase, idx) in form.roadmap"
                    :key="idx"
                    class="flex items-center justify-between px-3 py-2 bg-slate-700/50 rounded-lg"
                  >
                    <span class="text-white">{{ phase }}</span>
                    <button
                      type="button"
                      @click="form.roadmap.splice(idx, 1)"
                      class="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <UIcon
                        name="i-heroicons-trash-20-solid"
                        class="w-4 h-4"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Review & Submit -->
          <div v-if="currentStep === 3" class="space-y-6 animate-fadeIn">
            <h2 class="text-2xl font-bold text-white">Review Your Project</h2>

            <!-- Project Preview -->
            <div
              class="bg-slate-700/50 border border-slate-600 rounded-xl p-6 space-y-4"
            >
              <div class="flex items-start justify-between">
                <div class="space-y-2">
                  <div class="text-4xl">{{ form.emoji }}</div>
                  <h3 class="text-2xl font-bold text-white">
                    {{ form.title }}
                  </h3>
                  <p class="text-gray-400">
                    {{ form.category }} • {{ form.semester }}
                  </p>
                </div>
              </div>

              <p class="text-gray-300">{{ form.description }}</p>

              <div class="space-y-3 border-t border-slate-600 pt-4">
                <div v-if="form.technologies.length > 0">
                  <p class="text-xs text-gray-500">Technologies</p>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <UBadge
                      v-for="tech in form.technologies"
                      :key="tech"
                      color="primary"
                      variant="soft"
                      size="sm"
                    >
                      {{ tech }}
                    </UBadge>
                  </div>
                </div>

                <div v-if="form.teamMembers.length > 0">
                  <p class="text-xs text-gray-500">Team Members</p>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <UBadge
                      v-for="member in form.teamMembers"
                      :key="member"
                      color="info"
                      variant="soft"
                      size="sm"
                    >
                      {{ member }}
                    </UBadge>
                  </div>
                </div>

                <div v-if="form.duration">
                  <p class="text-xs text-gray-500">Duration</p>
                  <p class="text-white">{{ form.duration }}</p>
                </div>
              </div>
            </div>

            <!-- Terms Agreement -->
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="agreedToTerms"
                type="checkbox"
                class="w-4 h-4 mt-1 text-blue-600 rounded border-slate-600"
              />
              <span class="text-sm text-gray-300">
                I agree that my project will be shared with the GIC community
                and confirm all information is accurate and original work.
              </span>
            </label>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between pt-8 border-t border-slate-700">
            <ButtonsPresetButton
              v-if="currentStep > 0"
              preset="back"
              @click="currentStep--"
            />

            <div class="ml-auto flex gap-3">
              <ButtonsPresetButton
                v-if="currentStep < steps.length - 1"
                :label="`Next`"
                :icon="`i-heroicons-arrow-right`"
                color="primary"
                variant="solid"
                size="md"
                @click="currentStep++"
              />

              <ButtonsPresetButton
                v-if="currentStep === steps.length - 1"
                preset="submit"
                :disabled="!agreedToTerms"
                @click="$refs.form?.submit()"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Success Toast (optional) -->
      <Teleport to="body">
        <transition
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 transform translate-y-2"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition duration-300"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform translate-y-2"
        >
          <div
            v-if="showSuccess"
            class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6" />
            <span>Project created successfully!</span>
          </div>
        </transition>
      </Teleport>
    </UContainer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const steps = [
  { id: "basic", label: "Basic Info" },
  { id: "technical", label: "Technical" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
];

const currentStep = ref(0);
const agreedToTerms = ref(false);
const showSuccess = ref(false);

const techInput = ref("");
const memberInput = ref("");
const roadmapInput = ref("");

const form = ref({
  title: "",
  description: "",
  emoji: "🚀",
  category: "",
  semester: "",
  technologies: [],
  githubUrl: "",
  demoUrl: "",
  visibility: "public",
  duration: "",
  teamSize: 1,
  teamMembers: [],
  roadmap: [],
});

const addTechnology = () => {
  if (
    techInput.value.trim() &&
    !form.value.technologies.includes(techInput.value.trim())
  ) {
    form.value.technologies.push(techInput.value.trim());
    techInput.value = "";
  }
};

const addTeamMember = () => {
  if (
    memberInput.value.trim() &&
    !form.value.teamMembers.includes(memberInput.value.trim())
  ) {
    form.value.teamMembers.push(memberInput.value.trim());
    memberInput.value = "";
  }
};

const addRoadmapPhase = () => {
  if (roadmapInput.value.trim()) {
    form.value.roadmap.push(roadmapInput.value.trim());
    roadmapInput.value = "";
  }
};

const submitForm = async () => {
  // Here you would typically send the form data to your API
  console.log("Submitting project:", form.value);

  // Show success message
  showSuccess.value = true;

  // Redirect after 2 seconds
  setTimeout(() => {
    router.push("/projects");
  }, 2000);
};

useHead({
  title: "Create Project - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Create and share your student project with the GIC community",
    },
  ],
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
