<script lang="ts" setup>
import moment from "moment";
import { ref, computed, watch, toRefs } from "vue";
import { CHANNELS } from "@/constants/news";
import { getPostList, sendMsg } from "@/api/news";
import { message } from "ant-design-vue";

const newList = Object.freeze(CHANNELS);
const postList = ref([]);
const bizType = ref("frontend-test");
const indeterminate = ref(false);
const checkAll = ref(false);
const checkedList = ref([]);
const preList = ref([]);
const content = ref("");

const visible = ref(false);
const isLoading = ref(false);
const currentChannel = ref("");
const checkOptions = computed(() =>
  postList.value.map((post) => ({ label: post.title, value: post.href }))
);
const cache = ref({});
watch(
  () => checkedList.value,
  (val) => {
    indeterminate.value =
      !!val.length && val.length < checkOptions.value.length;
    checkAll.value = val.length === checkOptions.value.length;
  }
);
const handleCheckAll = (e: any) => {
  const all = checkOptions.value.map((item) => item.value);
  checkedList.value = e.target.checked ? all : [];
  indeterminate.value = false;
  checkAll.value = e.target.checked;
};
const onClick = async (item: any) => {
  visible.value = true;
  currentChannel.value = item.url;
  if (cache.value[currentChannel.value]?.list.length > 0) {
    const list = cache.value[currentChannel.value].list;
    checkedList.value = cache.value[currentChannel.value].checkedList || [];
    postList.value = list;
    return list;
  }
  isLoading.value = true;
  postList.value = [];
  const { data } = await getPostList({
    link: item.url,
    bizType: item.bizType,
  });
  if (data.success) {
    isLoading.value = false;
    const list = data.data || [];
    postList.value = list;
    cache.value[currentChannel.value] = {};
    cache.value[currentChannel.value].list = list;
  } else {
    message.error("加载失败!");
  }
};
const generateMessageTemplate = () => {
  const date = moment().format("YYYY/MM/DD");
  const header = `<font color=\"#389e0d\">前端早报-${date}</font>，欢迎大家阅读。\n`;
  const tail = `本服务由**[前端超神路](https://github.com/)**提供技术支持`;
  const body = preList.value
    .map((item, index) => `#### ${index + 1}. ${item}`)
    .join("\n");
  return `${header}\n>${body}\n\n${tail}`;
};
const updateContent = () => {
  content.value = generateMessageTemplate();
};

const handleConfirm = () => {
  visible.value = false;
  const selectedPosts = postList.value.filter((item: any) =>
    checkedList.value.includes(item.href as never)
  );
  const selectedList = selectedPosts.map((item, index) => {
    return `[${item.title.trim()}](${item.href})`;
  });
  console.log("selectedList", selectedList);
  preList.value = [...new Set([...preList.value, ...selectedList])];
  updateContent();
};
const handleSendMsg = async () => {
  const params = {
    content: content.value,
  };
  await sendMsg(params);
  message.success("发送成功!");
};
</script>

<template>
  <div class="home-wrapper">
    <a-row :gutter="16">
      <a-col :span="16">
        <a-card
          v-for="group in newList"
          :key="group.name"
          class="box-card"
          shadow="always"
        >
          <div class="clearfix">
            <span>{{ group.name }}</span>
          </div>
          <div class="channels">
            <a-button
              :style="{ 'margin-top': '10px', 'margin-left': '10px' }"
              size="large"
              v-for="item in group.list"
              :key="item.href"
              class="btn-channel"
              @click="onClick(item)"
            >
              {{ item.name }}
            </a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-form>
          <a-form-item
            :laba-col="{ span: 24 }"
            label="支持markdown输入"
            label-align="left"
          >
            <a-textarea
              v-model:value="content"
              placeholder="暂支持mardown语法"
              show-count
            />
          </a-form-item>
          <a-form-item>
            <a-button @click="handleSendMsg"> 发消息 </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

    <a-modal
      v-model:visible="visible"
      custom-class="post-modal"
      title="文章列表"
      @ok="handleConfirm"
    >
      <a-spin tip="Loading..." :spinning="isLoading">
        <div class="post-list">
          <div :style="{ borderBottom: '1px solid #E9E9E9' }">
            <a-checkbox
              v-model="checkAll"
              :indeterminate="indeterminate"
              @change="handleCheckAll"
              >全选</a-checkbox
            >
          </div>
          <br />
          <a-checkbox-group v-model:value="checkedList">
            <a-checkbox
              :value="item.value"
              v-for="item in checkOptions"
              :key="item.value"
            >
              {{ item.label }}
              <a
                class="a-button--text"
                style="font-size: 14px"
                target="_blank"
                :href="item.value"
                @click.stop
              >
                &nbsp; &nbsp;查看</a
              >
            </a-checkbox>
          </a-checkbox-group>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.home-wrapper {
  padding: 30px 20px;
}
.box-card:not(:first-of-type) {
  margin-top: 30px;
}
:deep {
  .btn-channel {
    margin-bottom: 16px;
  }
  .post-modal {
    font-size: 14px;
    line-height: 1.5;
    .post-list {
      height: 300px;
      overflow-y: auto;
    }
  }
}
.ant-checkbox-wrapper {
  margin-left: 0 !important;
}
</style>
