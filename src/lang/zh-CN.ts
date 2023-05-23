export default {
  placeholder: {
    question: '在此输入您的问题~',
    openai_key: '请输入OpenAI KEY',
    role_name: '角色名称',
    session_name: '会话名称',
    model_name: '模型名称',
    slightly_name: '微调模型名称',
    file_name: '文件名称',
    suffix: '末尾添加的文本片段',
    stop: '停止生成文本的令牌',
    response_count: '生成的答案次数',
    trainingDataFileID: '训练数据的文件ID',
    validationDataFileID: '验证数据文件ID',
    modelName: '模型名称',
    trainingIterations: '训练次数',
    batchSize: '每批数据的大小',
    learningRate: '学习率',
    ftsuffix: '后缀'
  },
  session: {
    title: '会话',
    create: '创建会话',
    export: '导出会话列表',
    import: '导入会话列表',
    clear: '清除会话列表'
  },
  model: {
    title: '模型',
    talk: '对话',
    online_title: '联网',
    online: '打开之后联网查询',
    suffix_title: '后缀',
    suffix: '在生成文本末尾添加的文本片段',
    max_tokens_title: '最大单词数',
    max_tokens: '指定要生成的最大单词数，不能超过2048。',
    temperature_title: '随机度（0-2）',
    temperature: '指定生成文本的随机性，范围是0到2，越高表示越多样化和创造性，越低表示越保守和确定性。',
    top_p_title: '保留词比例（0-1）',
    top_p: '指定在每个步骤中保留概率最高的单词的比例，范围是0到1，与temperature类似，但更加灵活和稳健。',
    n_title: '结果规模',
    n: '此参数会生成许多结果',
    stream_title: '流式输出',
    stream: '开启流式输出',
    echo_title: '回显词',
    echo: '回显提示词',
    stop_title: '停止令牌',
    stop: '设置模型停止生成文本的令牌',
    frequency_penalty_title: '单词重复度（0-1）',
    frequency_penalty: '指定降低重复单词出现概率的程度，范围是0到1，越高表示越避免重复。',
    presence_penalty_title: '话题重复度（0-1）',
    presence_penalty: '指定降低重复话题出现概率的程度，范围是0到1，越高表示越避免重复。',
    max_results_title: '指定联网查询数据的数量，不建议太大。',
    max_results: '查询规模'
  },
  slightly: {
    title: {
      whole: '微调',
      abbreviation: '微调'
    },
    retrieveFineTuning: '检索微调',
    cancelFineTuning: '取消微调',
    hideCanceledFineTuning: '隐藏已取消的微调',
    showCanceledFineTuning: '显示已取消的微调',
    deleteFineTuningModel: '删除微调模型',
    createFineTuning: '创建微调',
    create: '创建',
    fileIDTrainingData: '包含训练数据的文件ID',
    fileIDValidationData: '包含验证数据的文件ID',
    modelOptions: '您可以选择ada、babbage、curie、davinci或者是你自己通过微调训练的模型名称',
    epochs: '通过调整n_epochs的数量，可以控制模型的训练时期和训练次数，从而影响模型的性能和收敛速度',
    batchSize: '较大的 batch_size 可以加快模型的训练速度、模型的稳定性和泛化能力，较小的 batch_size 可以减少内存和计算资源的使用、提高模型在测试数据上的性能',
    fineTunedName: '最多 40 个字符的字符串，将添加到微调的模型名称中。',
    learningRate: '可以控制微调训练期间使用的学习率是预训练模型使用的学习率的多少倍。例如，如果您设置为2.0，则微调训练期间使用的学习率将是预训练模型使用的学习率的两倍。',
    promptAttention: '设置较高的值，那么模型在生成文本时会更加注重提示，设置较低的值模型则会更加注重自己的语言模型，生成更自由的文本'
  },
  file: {
    title: '文件',
    upload: '上传文件',
    delete: '删除文件',
    retrieve: '检索文件',
    view: '查看文件内容'
  },
  image: {
    title: '图片',
    production: '产图模式',
    production_title: '打开之后聊天发送的内容为描述图片的信息',
    change: '改图模式',
    change_title: '打开之后先上传图片，然后再输入提示词进行修改。',
    size: '图片大小',
    size_title: '生成图片的大小',
    count: '图片数量',
    count_title: '生成图片的数量'
  },
  audio: {
    title: '音频',
    to_text_title: '语音转文字',
    to_text: '语音转文字',
    language_title: '将一个或多个来源语言的语音或音频文件翻译成目标语言',
    language: '语言',
    temperature_title: '指定语音识别的随机性，范围是0到1，越高表示越多样化和创造性，越低表示越保守和确定性。',
    temperature: '随机度（0-1）'
  },
  role: {
    title: '角色'
  },
  setting: {
    title: '设置',
    Language: '英文语言'
  },
  file_card: {
    unknown: '未知'
  },
  person_card: {
    train: '正在训练...',
    cancel: '已取消'
  },
  util_js: {
    select: '请选择要上传的图片!',
    path: '路径不正确!',
    notallowed: '该文件类型不允许上传。请上传 ',
    type: ' 类型的文件，当前文件类型为'
  },
  message: {
    start_recording: '开始录音咯~',
    fail_audio: '获取音频流失败啦~',
    end_recording: '结束录音咯~',
    edit_picture: '编辑图片模式：请您聊天窗口右上角先上传图片，再发送修改的内容~',
    msg_empty: '消息不能为空哦~',
    model_del: '模型已被删除或已取消...',
    valid_png: '请上传一个有效的PNG文件~',
    less_4M: '请上传一个小于4MB的文件~',
    upload_complete: '图片上传完成啦，请给我提示进行编辑~',
    get_model_fail: '获取模型列表失败哦~~',
    valid_json: '请上传一个有效的JSON文件~~',
    only_file: '只能检索文件哦~',
    fail_file: '文件检索失败了~',
    openai_free: 'OpenAI为了减少滥用，免费帐户将无法下载微调训练的文件~',
    only_del_file: '只能删除文件哦~',
    del_file_succ: '恭喜您删除成功~',
    del_fail: '文件删除失败了~',
    create_succ: '恭喜您微调创建成功~',
    create_fail: '微调创建失败了...',
    only_del_model: '只能删除微调中的模型哦~',
    del_model_succ: '恭喜您微调模型删除成功~',
    del_fail_ing: '微调模型删除失败了,模型正在训练中或者中途已取消',
    only_cancel: '只能取消进行训练中的微调模型哦~',
    cancel_succ: '成功取消此模型~',
    cancel_fail: '取消微调模型失败~',
    only_model: '只能检索的微调模型哦~',
    verify_model_fail: '检索微调模型失败~',
    get_files_fail: '获取文件列表失败哦~',
    get_roles_fail: '获取角色列表失败哦~'
  },
  index: {
    detail: 'chatgpt v3.5 所基于的模型',
    lastMsg: 'chatgpt v3.5 所基于的模型',
    up_file_id: '文件已上传成功,文件ID是',
    copy: ',已经帮您复制啦~',
    file_id: '`文件ID:`',
    file_name: '`文件名称:`',
    file_size: '`文件大小:`',
    obj: '`对象:`',
    status: '`状态:`',
    status_des: '`状态描述`',
    target: '`目的` ',
    file_time: '`文件创建时间`',
    task_id: '`微调任务ID:`',
    task_type: '`任务类型:`',
    model_type: '`模型的类型:`',
    task_time: '`微调任务的创建时间:`',
    task_list: '`微调的事件列表`  \n',
    obj_log_info_time: '| 对象 | 日志级别 | 信息 | 创建时间  |\n',
    model_id: '\n `微调的模型ID:`',
    args: '\n\n `微调使用的参数:` \n',
    item_setting: '| 属性 | 设置的值 | \n',
    user_group: '\n`用户所属组:`',
    results_null: '\n\n`训练结果文件列表:没有`\n\n',
    results: '\n\n`训练结果文件列表:`\n\n',
    table_head: '| ID  | 文件名称 | 文件大小 |   对象 | 状态 |    \n',
    statu: '\n`状态:`',
    files_null: '\n\n`训练的文件列表:没有`\n\n',
    files: '\n\n`训练的文件列表:`\n\n',
    verifys_null: '\n\n`验证的文件列表:没有`\n\n',
    verifys: '\n\n`验证的文件列表:`\n\n',
    last_time: '\n`最后更新时间戳:`'
  }
};
