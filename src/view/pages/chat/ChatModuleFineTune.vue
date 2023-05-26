<template>
  <div>
    <!-- 检索微调 -->
    <div class="fineTune boxinput" @click="handleAsyncOperation('finetune:retrieve')" style="margin-left: 0px; margin-right: 0px; width: 99%">
      {{ $t('slightly.retrieveFineTuning') }}
    </div>

    <!-- 取消微调 -->
    <div class="fineTune boxinput" @click="handleAsyncOperation('finetune:cancel')" style="margin-left: 0px; margin-right: 0px; width: 99%">
      {{ $t('slightly.cancelFineTuning') }}
    </div>

    <!-- 是否展示已取消的微调 -->
    <div class="fineTune boxinput" @click="handleAsyncOperation('finetune:cancel:show/hide', false)" v-if="CancelFineStatus" style="margin-left: 0px; margin-right: 0px; width: 99%">
      {{ $t('slightly.hideCanceledFineTuning') }}
    </div>
    <div class="fineTune boxinput" @click="handleAsyncOperation('finetune:cancel:show/hide', true)" v-else style="margin-left: 0px; margin-right: 0px; width: 99%">
      {{ $t('slightly.showCanceledFineTuning') }}
    </div>

    <!-- 删除微调 -->
    <div class="fineTune boxinput" @click="handleAsyncOperation('finetune:delete')" style="margin-left: 0px; margin-right: 0px; width: 99%">
      <span class="iconfont icon-shanchu" style="color: #fff; margin-right: 10px"></span>
      {{ $t('slightly.deleteFineTuningModel') }}
    </div>

    <!-- 是否展示创建微调 -->
    <div class="fineTune boxinput" @click="showFineSetting = !showFineSetting" style="margin-left: 0px; margin-right: 0px; width: 99%">
      {{ $t('slightly.createFineTuning') }}
    </div>

    <!-- 创建微调参数 -->
    <el-collapse-transition>
      <div v-show="showFineSetting">
        <div class="block">
          <el-tooltip class="item" effect="dark" :content="$t('slightly.fileIDTrainingData')" placement="top">
            <span class="demonstration">trainingFile<span style="color: red">*</span></span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.training_file" :placeholder="$t('placeholder.trainingDataFileID')" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" :content="$t('slightly.fileIDValidationData')" placement="top">
            <span class="demonstration" style="">validationFile</span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.validation_file" :placeholder="$t('placeholder.validationDataFileID')" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" :content="$t('slightly.modelOptions')" placement="top">
            <span class="demonstration">model</span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.model" :placeholder="$t('placeholder.modelName')" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" :content="$t('slightly.epochs')" placement="top">
            <span class="demonstration">nEpochs</span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.n_epochs" type="number" :placeholder="$t('placeholder.trainingIterations')" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" :content="$t('slightly.batchSize')" placement="top">
            <span class="demonstration">batchSize</span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.batch_size" type="number" :placeholder="$t('placeholder.batchSize')" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" :content="$t('slightly.learningRate')" placement="top">
            <span class="demonstration">learningRateMultiplier</span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.learning_rate_multiplier" type="number" :placeholder="$t('placeholder.learningRate')" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" content="分类任务中的类数,此参数对于多类分类是必需的" placement="top">
            <span class="demonstration" style="">classificationNClasses</span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.classification_n_classes" type="number" placeholder="分类任务中的类数" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" content="二元分类中的正类,需要此参数来生成精度、召回率和 F1 执行二元分类时的指标。" placement="top">
            <span class="demonstration" style="">classificationPositiveClass</span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.classification_positive_class" type="text" placeholder="二元分类中的正类" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" content="将计算指定 F-beta 分数 贝塔值。F-beta 分数是 F-1 分数的概括。 这仅用于二元分类。" placement="top">
            <span class="demonstration" style="">classificationBetas</span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.classification_betas" placeholder="分类贝塔" type="text" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" :content="$t('slightly.fineTunedName')" placement="top">
            <span class="demonstration" style="">suffix</span>
          </el-tooltip>
          <input class="weitiao" v-model="SettingInfo.fineTunes.suffix" :placeholder="$t('placeholder.ftsuffix')" />
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" :content="$t('slightly.promptAttention')" placement="top">
            <span class="demonstration" style="">promptLossWeight</span>
          </el-tooltip>
          <el-slider class="astrict" v-model="SettingInfo.fineTunes.prompt_loss_weight" :step="0.01" :min="0.01" :max="1" style="width: 95%"></el-slider>
        </div>

        <div class="block">
          <el-tooltip class="item" effect="dark" content="用于确定是否在训练过程中计算分类特定的指标，例如准确率和F-1分数,可以在结果文件中查看这些指标." placement="top">
            <span class="demonstration" style="">computeClassificationMetrics</span>
          </el-tooltip>
          <div>
            <el-switch v-model="SettingInfo.fineTunes.compute_classification_metrics" :width="defaulWidth" style="margin-top: 15px; margin-left: 35%"></el-switch>
          </div>
        </div>

        <div class="fineTune boxinput" @click="handleAsyncOperation('finetune:create')" style="margin-left: 0px; margin-right: 0px; width: 99%; background-color: #409eff">
          {{ $t('slightly.create') }}
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElNotification } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { createFineTune, cancelFineTune, deleteFineTuneModel, retrieveFineTune } from '@/api/getData'; // prettier-ignore
import { getNowTime, formatDateTime, formatTimestamp } from '@/utils/util';
import { AI_HEAD_IMG_URL } from '@/store/mutation-types';

const { t: $t } = useI18n();
const emits = defineEmits(['update:settingInfo', 'update:cancelFineStatus', 'update:fineTuningList', 'update:fineTuningCacheList']);
const props = defineProps({
  defaulWidth: { type: Number, default: 70 },
  // 参数
  fineTuningInfo: { type: Object, default: () => ({}) },
  settingInfo: { type: Object, default: () => ({}) },
  cancelFineStatus: { type: Boolean, default: false },
  fineTuningList: { type: Array, default: () => [] },
  fineTuningCacheList: { type: Array, default: () => [] },
  // 方法
  getFineTunessList: { type: Function, default: () => {} },
  sendMsg: { type: Function, default: () => {} }
});

const SettingInfo = ref(props.settingInfo);
const CancelFineStatus = ref(props.cancelFineStatus);
const FineTuningList = ref(props.fineTuningList);
const FineTuningCacheList = ref(props.fineTuningCacheList);

const showFineSetting = ref(false);

watch(SettingInfo, val => emits('update:settingInfo', val));
watch(CancelFineStatus, val => emits('update:cancelFineStatus', val));
watch(FineTuningList, val => emits('update:fineTuningList', val));
watch(FineTuningCacheList, val => emits('update:fineTuningCacheList', val));

// finetune:create -> 创建微调
// finetune:retrieve -> 查看微调
// finetune:cancel -> 取消微调
// finetune:delete -> 删除微调
// finetune:cancel:show/hide -> 显示或隐藏取消微调按钮
const handleAsyncOperation = (type: string, args?: any) => {
  switch (type) {
    case 'finetune:create': {
      createFineTune(SettingInfo.value.fineTunes, SettingInfo.value.openaiKey)
        .then(res => {
          ElNotification.success($t('message.create_succ'));
          props.getFineTunessList(SettingInfo.value.openaiKey);
        })
        .catch(e => {
          ElNotification.error($t('message.create_fail'));
        });
      break;
    }
    case 'finetune:retrieve': {
      if (!props.fineTuningInfo || !props.fineTuningInfo.fineTunesId) {
        ElNotification.error($t('message.only_model'));
      } else {
        retrieveFineTune(props.fineTuningInfo.fineTunesId, SettingInfo.value.openaiKey)
          .then(res => {
            let context =
              $t('index.task_id') +
              res.id +
              '  \n' +
              $t('index.task_type') +
              res.object +
              '  \n' +
              $t('index.model_type') +
              res.model +
              '  \n' +
              $t('index.task_time') +
              formatTimestamp(res.created_at) +
              '  \n' +
              $t('index.task_list') +
              $t('index.obj_log_info_time') +
              '| :------: | :------: | :------: | :------: |\n';
            res.events.forEach(obj => {
              context += `| ${obj.object} | ${obj.level} | ${obj.message} | ${formatTimestamp(obj.created_at)} |\n`;
            });
            context += $t('index.model_id') + res.fine_tuned_model + $t('index.args') + $t('index.item_setting') + '| :------: | :------: | \n';
            for (let prop in res.hyperparams) {
              if (res.hyperparams.hasOwnProperty(prop)) {
                context += `| ${prop} | ${res.hyperparams[prop]} |\n`;
              }
            }
            context += $t('index.user_group') + res.organization_id;

            if (res.result_files.length == 0) {
              context += $t('index.results_null');
            } else {
              context += $t('index.results') + $t('index.table_head') + '| :------: | :------: | :------: | :------: | :------: | \n';
              res.result_files.forEach(obj => {
                context += `| ${obj.id} | ${obj.filename}  | ${(obj.bytes / 1024 / 1024).toFixed(2) + 'MB'} | ${obj.object} | ${obj.status} |  \n`;
              });
            }
            context += $t('index.statu') + res.status + '\n';

            if (res.training_files.length == 0) {
              context += $t('index.files_null');
            } else {
              context += $t('index.files') + $t('index.table_head') + '| :------: | :------: | :------: | :------: | :------: | \n';
              res.training_files.forEach(obj => {
                context += `| ${obj.id} | ${obj.filename}  | ${(obj.bytes / 1024 / 1024).toFixed(2) + 'MB'} | ${obj.object} | ${obj.status} |  \n`;
              });
            }
            if (res.validation_files.length == 0) {
              context += $t('index.verifys_null');
            } else {
              context += $t('index.verifys') + $t('index.table_head') + '| :------: | :------: | :------: | :------: | :------: | \n';
              res.validation_files.forEach(obj => {
                context += `| ${obj.id} | ${obj.filename}  | ${(obj.bytes / 1024 / 1024).toFixed(2) + 'MB'} | ${obj.object} | ${obj.status} |  \n`;
              });
            }
            context += $t('index.last_time') + formatTimestamp(res.updated_at);
            let retrieveFineTuneMsg = {
              headImg: AI_HEAD_IMG_URL,
              name: res.fine_tuned_model !== null ? res.fine_tuned_model : res.id,
              time: formatDateTime(getNowTime()),
              msg: context,
              chatType: 0,
              uid: res.id
            };
            // 发送消息
            props.sendMsg(retrieveFineTuneMsg);
          })
          .catch(e => {
            console.log(e);
            ElNotification.error($t('message.verify_model_fail'));
          });
      }
      break;
    }
    case 'finetune:cancel': {
      if (!props.fineTuningInfo || !props.fineTuningInfo.fineTunesId || props.fineTuningInfo.fineTunesStatus === 'succeeded') {
        ElNotification.error($t('message.only_cancel'));
      } else {
        cancelFineTune(props.fineTuningInfo.fineTunesId, SettingInfo.value.openaiKey)
          .then(res => {
            ElNotification.success($t('message.cancel_succ'));
            props.getFineTunessList(SettingInfo.value.openaiKey);
          })
          .catch(e => {
            ElNotification.error($t('message.cancel_fail'));
          });
      }
      break;
    }
    case 'finetune:delete': {
      if (!props.fineTuningInfo || !props.fineTuningInfo.fineTunesId) {
        ElNotification.error($t('message.only_del_model'));
      } else {
        deleteFineTuneModel(props.fineTuningInfo.name, SettingInfo.value.openaiKey)
          .then(res => {
            ElNotification.success($t('message.del_model_succ'));
            props.getFineTunessList(SettingInfo.value.openaiKey);
          })
          .catch(e => {
            ElNotification.error($t('message.del_fail_ing'));
          });
      }
      break;
    }
    case 'finetune:cancel:show/hide': {
      CancelFineStatus.value = args;
      if (CancelFineStatus.value == true) FineTuningList.value = FineTuningCacheList.value;
      else FineTuningList.value = FineTuningCacheList.value.filter((finetune: any) => finetune.fineTunesStatus === 'succeeded');
      break;
    }
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
@import url('/src/assets/styles/chat.base.css');
</style>
