/**
 * created by name on time
 */

import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Style from './index.module.less'

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    console.warn(router, route);

    onMounted(() => {

    });

    return () => {
      return (
        <div class={Style.styleName}>
            
        </div>
      );
    };
  }
});