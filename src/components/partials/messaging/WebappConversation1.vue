<script setup lang="ts">
const emit = defineEmits(['toggleMobileConversation'])

const { onceError } = useImageError()
</script>

<template>
  <div
    id="navbar-conversation-1"
    class="chat-area-content"
  >
    <div class="chat-area-header">
      <button
        class="trigger conversations-mobile-trigger h-only-mobile h-only-tablet-p h-only-tablet-l"
        @click="emit('toggleMobileConversation')"
      >
        <VIcon
          icon="lucide:menu"
        />
      </button>
      <div class="chat-area-title">
        Kelly M.
      </div>
      <div class="chat-area-group">
        <img
          class="chat-area-profile"
          src="https://media.cssninja.io/content/avatars/11.jpg"
          alt=""
          data-user-popover="13"
          @error.once="onceError($event, 150)"
        >
      </div>
    </div>
    <div class="chat-area-main">
      <div class="chat-msg">
        <div class="chat-msg-profile">
          <img
            class="chat-msg-img"
            src="https://media.cssninja.io/content/avatars/11.jpg"
            alt=""
            data-user-popover="13"
            @error.once="onceError($event, 150)"
          >
          <div class="chat-msg-date">
            Sent at 1:03pm
          </div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">
            hey Erik, what's up?
          </div>
          <div class="chat-msg-text">
            <img
              src="https://media.cssninja.io/content/photos/apps/7.png"
              alt=""
              @error.once="onceError($event, 400, 300)"
            >
          </div>
          <div class="chat-msg-text">
            I think it's time to review those slides we talked about.
          </div>
        </div>
      </div>
      <div class="chat-msg owner">
        <div class="chat-msg-profile">
          <img
            class="chat-msg-img"
            src="/images/avatars/svg/vuero-1.svg"
            alt=""
            data-user-popover="3"
            @error.once="onceError($event, 150)"
          >
          <div class="chat-msg-date">
            Sent at 1:22pm
          </div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">
            Yeah I know, well I feel a bit miserable about that
            <span
              role="img"
              aria-label="Faces with Tears of Joy"
            >😂</span>.
          </div>
          <div class="chat-msg-text">
            I was working on that till 4:00 am.
          </div>
        </div>
      </div>
      <div class="chat-msg">
        <div class="chat-msg-profile">
          <img
            class="chat-msg-img"
            src="https://media.cssninja.io/content/avatars/11.jpg"
            alt=""
            data-user-popover="13"
            @error.once="onceError($event, 150)"
          >
          <div class="chat-msg-date">
            Sent at 1:22pm
          </div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">
            Oh my god! Don't push youself that much!
          </div>
          <div class="chat-msg-text">
            You got to take some rest tomorrow.
          </div>
          <div class="chat-msg-text">
            What time was our meeting scheduled for?
          </div>
        </div>
      </div>
      <div class="chat-msg owner">
        <div class="chat-msg-profile">
          <img
            class="chat-msg-img"
            src="/images/avatars/svg/vuero-1.svg"
            alt=""
            data-user-popover="3"
            @error.once="onceError($event, 150)"
          >
          <div class="chat-msg-date">
            Sent at 1:23pm
          </div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">
            3:15 pm I believe.
          </div>
          <div class="chat-msg-text">
            Let me check the schedule
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
