import { onBeforeUnmount, onMounted, ref } from "vue";

export function useTableHeight(bottomReserved = 176) {
  const height = ref(420);

  function update() {
    height.value = Math.max(window.innerHeight - bottomReserved, 280);
  }

  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", update);
  });

  return height;
}
