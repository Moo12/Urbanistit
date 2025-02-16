<template>
  <div class="ridection">
    <Navbar :menuItems="menuItems" />
    <div class="content">
      <router-view/>
    </div>
  </div>
  <div>
    <Footer :menuItems="menuFooterItems" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import gurFooterIcon from '@/assets/img/gur_footer_icon.png'

export default {
  components: {
    Navbar,
    Footer
  },

  setup(){
    const menuItems = [
        { text: "פרויקטים", href: "#projects_section" },
        { text: "בלוג", href: "#blog_section" },
        { text: "צור קשר", href: "#contactme_section" }
    ];

    const menuFooterItems = [
        { text: "צור קשר", href: "#contactme_section" },
        { text: "בלוג", href: "#blog_section" },
        { text: "פרויקטים", href: "#projects_section" },
        { text: "מי אני", href: "#introduction" }
    ];


    const homeAnchor = {
      text: "home",
      href: "/",
      image: "",
    };

    const middleIndex = Math.floor(menuFooterItems.length / 2);
    menuFooterItems.splice(middleIndex, 0, homeAnchor);

      return { menuItems, menuFooterItems }
  }
}

</script>


<style>
.content{
  margin: 0 auto;
  max-width: auto;
  padding: 0 20px;
}

body.rtl {
  direction: rtl;
  text-align: right;
}

</style>
