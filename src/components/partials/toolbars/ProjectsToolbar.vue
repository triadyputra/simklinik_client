<template>
  <div class="projects-toolbar">
    <VField raw>
      <VControl icon="lucide:search">
        <VInput placeholder="Search again..." />
      </VControl>
    </VField>

    <VAvatarStack>
      <VAvatar
        size="small"
        picture="https://media.cssninja.io/content/avatars/7.jpg"
      />
      <VAvatar
        size="small"
        picture="https://media.cssninja.io/content/avatars/9.jpg"
      />
      <VAvatar
        size="small"
        picture="https://media.cssninja.io/content/avatars/12.jpg"
      />
      <VAvatar
        size="small"
        picture="/images/avatars/svg/vuero-1.svg"
      />
      <VAvatar
        size="small"
        picture="https://media.cssninja.io/content/avatars/25.jpg"
      />
      <VAvatar
        size="small"
        picture="https://media.cssninja.io/content/avatars/22.jpg"
      />
    </VAvatarStack>

    <a class="button v-button is-primary is-raised is-bold">
      <span>New Project</span>
    </a>
  </div>
</template>

<style lang="scss">
.projects-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .avatar-stack {
    margin-inline-start: 16px;
  }

  .button {
    margin-inline-start: auto;
    min-width: 140px;
  }
}

.is-dark {
  .projects-toolbar {
    .avatar-stack {
      .avatar {
        border-color: color-mix(in oklab, var(--dark-sidebar), white 3%);
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .projects-toolbar {
    .avatar-stack {
      display: none;
    }

    .v-button {
      min-width: 110px;
    }
  }
}
</style>
