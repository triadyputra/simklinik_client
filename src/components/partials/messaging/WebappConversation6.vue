<script setup lang="ts">
const emit = defineEmits(['toggleMobileConversation'])

const { onceError } = useImageError()
</script>

<template>
  <div
    id="navbar-conversation-6"
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
        Mary L.
      </div>
      <div class="chat-area-group">
        <img
          class="chat-area-profile"
          src="https://media.cssninja.io/content/avatars/5.jpg"
          alt=""
          data-user-popover="5"
          @error.once="onceError($event, 150)"
        >
      </div>
    </div>
    <div class="chat-area-main">
      <div class="chat-msg">
        <div class="chat-msg-profile">
          <img
            class="chat-msg-img"
            src="https://media.cssninja.io/content/avatars/5.jpg"
            alt=""
            data-user-popover="5"
            @error.once="onceError($event, 150)"
          >
          <div class="chat-msg-date">
            Sent at 12:14pm
          </div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">
            Hey Erik!.
          </div>
          <div class="chat-msg-text">
            Still down for that movie?
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
            Sent at 12:14pm
          </div>
        </div>
        <div class="chat-msg-content">
          <div class="chat-msg-text">
            Of course, yeah!
          </div>
          <div class="chat-msg-text">
            Can't wait!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
