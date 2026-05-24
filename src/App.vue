<script setup>
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();
</script>

<template>
  <div class="min-h-screen flex flex-col font-jakarta">
    <Navbar v-if="!$route.meta.hideNav" />

    <router-view />

    <Footer v-if="!$route.meta.hideNav" />
  </div>
</template>

<style>
:root {
  background-color: white;
  color: #1e293b;
}

body {
  margin: 0;
  padding: 0;
}
</style>
