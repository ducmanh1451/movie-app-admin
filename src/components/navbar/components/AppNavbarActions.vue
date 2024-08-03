<template>
  <div class="app-navbar-actions">
    <!-- <GithubButton v-if="!isMobile" class="app-navbar-actions__item" /> -->
    <!-- <VaButton
      v-if="!isMobile"
      preset="secondary"
      href="https://admin.vuestic.dev/"
      target="_blank"
      color="textPrimary"
      class="app-navbar-actions__item flex-shrink-0 mx-0"
    >
      {{ t('aboutVuesticAdmin') }}
    </VaButton> -->
    <!-- <VaButton
      v-if="!isMobile"
      preset="secondary"
      href="https://discord.gg/u7fQdqQt8c"
      target="_blank"
      color="textPrimary"
      class="app-navbar-actions__item flex-shrink-0 mx-0"
    >
      {{ t('helpAndSupport') }}
    </VaButton> -->
    <!-- <NotificationDropdown class="app-navbar-actions__item" /> -->
    <!-- <ProfileDropdown class="app-navbar-actions__item app-navbar-actions__item--profile mr-1" /> -->

    <div class="p-3 mr-2 rounded hover:bg-gray-300 transition-all duration-300 cursor-pointer flex items-center">
      <VaIcon name="person" size="22px" />
      <span class="mx-2">{{ authStore.staffData.user_name }}</span>
    </div>
    <div class="p-3 mr-2 rounded hover:bg-gray-300 transition-all duration-300 cursor-pointer" @click="logout">
      <VaIcon name="logout" size="22px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// import ProfileDropdown from './dropdowns/ProfileDropdown.vue'
// import NotificationDropdown from './dropdowns/NotificationDropdown.vue'
import { useAuthStore } from '../../../stores/auth-store'
import { useRouter } from 'vue-router'

// props
defineProps({
  isMobile: { type: Boolean, default: false },
})
// vars
const authStore = useAuthStore()
const { push } = useRouter()
// funcs
const logout = () => {
  authStore.logout()
  // go to home page after logout success
  push({ name: 'login' })
}
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;

  .va-dropdown__anchor {
    color: var(--va-primary);
    fill: var(--va-primary);
  }

  &__item {
    padding: 0;
    margin-left: 0.25rem;
    margin-right: 0.25rem;

    svg {
      height: 20px;
    }

    &--profile {
      display: flex;
      justify-content: center;
    }

    .va-dropdown-content {
      background-color: var(--va-white);
    }

    @media screen and (max-width: 640px) {
      margin-left: 0;
      margin-right: 0;

      &:first-of-type {
        margin-left: 0;
      }
    }
  }

  .fa-github {
    color: var(--va-on-background-primary);
  }
}
</style>
