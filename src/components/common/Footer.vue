<script setup>
const teamMembers = [
  {
    name: "이준영",
    github: "https://github.com/osanThor",
  },
  {
    name: "최보아",
    github: "https://github.com/swallowedB",
  },
  {
    name: "허정민",
    github: "https://github.com/gjwjdals96",
  },
  {
    name: "박지운",
    github: "https://github.com/uoomif",
  },
  {
    name: "우정완",
    github: "https://github.com/WJoungWan",
  },
];
</script>

<template>
  <footer class="w-full max-w-[100vw] bg-main-700/10 mt-20">
    <div class="max-w-7xl mx-auto px-8">
      <div class="py-8">
        <div class="flex items-center justify-center">
          <!-- 팀 로고 -->
          <div class="opacity-80 hover:opacity-100 transition-opacity">
            <img
              src="/assets/images/logo.png"
              alt="Project Logo"
              class="h-4 w-auto"
            />
          </div>

          <!-- 멤버 목록 -->
          <div class="flex items-center pl-8">
            <template v-for="(member, index) in teamMembers" :key="member.name">
              <a
                :href="member.github"
                target="_blank"
                rel="noopener noreferrer"
                class="w-32 px-4 py-2 transition-all duration-200 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <div class="text-center">
                  <h3 class="text-white/90 text-xs font-medium">
                    {{ member.name }}
                  </h3>
                  <p class="text-white/40 text-[10px] mt-0.5">
                    @{{ member.github.split("github.com/")[1] }}
                  </p>
                </div>
              </a>
              <!-- 멤버 구분선 -->
              <div
                v-if="index !== teamMembers.length - 1"
                class="h-6 w-px bg-white/10"
              ></div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
