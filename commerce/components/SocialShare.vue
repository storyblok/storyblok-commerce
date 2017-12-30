<template>
  <ul class="socialshare">
    <li class="socialshare-item">
      <a class="socialshare-item__link" @click="openShareWindow('facebook')"><span uk-icon="icon: facebook"></span></a>
    </li>
  </ul>
</template>

<script>
/* eslint-disable */
export default {
  data: function() {
    return {
      shareUrls :{
        "facebook": `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        "twitter": `https://twitter.com/home?status=Have%20a%20look%20at%3A%2${encodeURIComponent(window.location.href)}`
      }
    }
  },

  methods: {
    openShareWindow(type) {
      window.open(this.shareUrls[type], '_blank', 'location=no,height=300,width=500,scrollbars=yes,status=yes');
    }
  }
}
</script>
