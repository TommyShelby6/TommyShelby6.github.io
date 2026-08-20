const sharedResource = {
  label: "ZXC实习项目展示",
  url: "https://pan.baidu.com/s/1Mng4nxr41-DSrm0MSzcSlQ?pwd=x47t",
  password: "x47t",
};

const projects = [
  {
    id: 1,
    title: "多品牌中央空调协议网关",
    description:
      "这是一个面向住宅和别墅场景的多品牌中央空调接入项目，主要负责把上位机控制系统与不同品牌、不同数量的空调设备连接起来。项目启动后，网关先读取现场的通信端口、空调品牌、设备数量和地址等配置，并保存到本地，设备重新上电后可以自动恢复。运行时，上位机下发开关机、运行模式、设定温度和风速等控制请求，网关完成数据校验和设备定位，再将统一指令转换为大金、海尔、日立等品牌能够识别的格式，通过现场通信总线发送给空调。与此同时，网关会周期性查询空调的实际运行状态，将变化后的状态整理成统一信息回传给上位机。针对同一组设备不能同时制冷和制热的问题，项目增加了分阶段的模式切换和状态协调流程，减少指令竞争与状态错乱。整体还覆盖通信超时、错误反馈、看门狗保护、配置持久化和固件升级，形成了从现场配置、指令下发、设备执行到状态回传的完整闭环。",
    focus: ["多品牌协议适配", "指令下发与状态回读", "模式协调与异常恢复"],
    resource: sharedResource,
    media: [],
  },
  {
    id: 2,
    title: "面向住宅智能屏的可视对讲终端",
    description:
      "这是一个运行在嵌入式 Linux 智能屏上的住宅可视对讲终端，围绕住户、访客和物业管理中心之间的沟通设计。设备启动后会根据项目配置加载主界面、页面布局和功能入口，用户可以在屏幕上完成呼叫、接听、查看视频、开锁和结束通话等操作。一次完整的监控或对讲流程通常从按钮点击开始，系统先判断当前设备和业务状态，再发送控制请求；确认对端响应后建立音视频会话，接收并整理视频画面，在屏幕上实时显示，通话结束时统一释放会话和播放资源。除可视对讲和门禁功能外，终端还支持摄像头监视、报警提示与上报、物业广播、留言、访客服务，以及灯光和家庭设备控制。系统将控制消息与视频数据分开处理，并对超时、失败、设备切换后的旧响应进行过滤，提升使用稳定性。页面、业务流程、设备通信和媒体播放按模块组织，同一套程序可通过调整配置和素材适配不同住宅项目，便于后续扩展和维护。",
    focus: ["可视对讲与门禁开锁", "视频监控与会话管理", "配置化页面与家庭联动"],
    resource: sharedResource,
    media: [],
  },
];

let activeId = 1;
let toastTimer;

const projectItems = document.querySelector("#projectItems");
const projectCount = document.querySelector("#projectCount");
const mainArea = document.querySelector("#mainArea");
const mediaInput = document.querySelector("#mediaInput");
const newProjectModal = document.querySelector("#newProjectModal");
const mediaLinkModal = document.querySelector("#mediaLinkModal");
const toast = document.querySelector("#toast");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getActiveProject() {
  return projects.find((project) => project.id === activeId) || null;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = `✓ ${message}`;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

function openModal(modal) {
  modal.hidden = false;
  const firstInput = modal.querySelector("input");
  window.setTimeout(() => firstInput?.focus(), 20);
}

function closeModal(modal) {
  modal.hidden = true;
}

function renderProjectList() {
  projectCount.textContent = projects.length;
  projectItems.innerHTML = projects
    .map(
      (project) => `
        <button class="project-item ${project.id === activeId ? "active" : ""}" type="button" data-project-id="${project.id}">
          <span class="project-dot"></span>
          <span>
            <strong>${escapeHtml(project.title)}</strong>
            <small>${project.media.length} 个媒体文件</small>
          </span>
          <b>›</b>
        </button>
      `,
    )
    .join("");

  projectItems.querySelectorAll("[data-project-id]").forEach((button) => {
    button.addEventListener("click", () => {
      activeId = Number(button.dataset.projectId);
      render();
      if (window.innerWidth < 821) {
        mainArea.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function renderMedia(project) {
  if (!project.media.length) {
    return `
      <div class="media-empty">
        <div class="empty-icon">＋</div>
        <h3>还没有展示素材</h3>
        <p>可以选择本地文件临时预览，或添加一个公开的图片 / 视频链接<br />让面试官更快了解你的工作成果</p>
        <div>
          <button type="button" data-action="choose-media">选择本地文件</button>
          <button type="button" class="empty-link" data-action="add-link">添加公开链接</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="media-grid">
      ${project.media
        .map(
          (media) => `
            <article class="media-card">
              <div class="media-frame">
                ${
                  media.kind === "video"
                    ? `<video src="${escapeHtml(media.url)}" controls controlslist="nodownload" disablepictureinpicture></video>`
                    : `<img src="${escapeHtml(media.url)}" alt="${escapeHtml(media.name)}" draggable="false" />`
                }
              </div>
              <div class="media-name">${escapeHtml(media.name)}</div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderMainArea() {
  const project = getActiveProject();
  if (!project) {
    mainArea.innerHTML = `
      <div class="welcome">
        <div class="welcome-mark">✦</div>
        <p class="overline">YOUR INTERNSHIP STORY</p>
        <h1>让成果<br /><em>自己说话。</em></h1>
        <p>从左侧选择一个项目，查看项目功能、实现流程和完整资料。</p>
        <button class="welcome-button" type="button" data-action="select-first">查看第一个项目 <span>→</span></button>
      </div>
    `;
    mainArea.querySelector("[data-action='select-first']")?.addEventListener("click", () => {
      activeId = projects[0]?.id ?? null;
      render();
    });
    return;
  }

  const number = String(projects.indexOf(project) + 1).padStart(2, "0");
  mainArea.innerHTML = `
    <div class="detail-top">
      <button class="back" type="button" data-action="back">← 返回项目列表</button>
    </div>

    <div class="project-intro">
      <p class="overline">PROJECT ${number}</p>
      <h1>${escapeHtml(project.title)}</h1>
      <p class="description">${escapeHtml(project.description)}</p>
    </div>

    <div class="project-highlights">
      ${project.focus.map((item) => `<span class="highlight-tag">${escapeHtml(item)}</span>`).join("")}
    </div>

    <div class="resource-panel">
      <div>
        <p class="resource-kicker">PROJECT MATERIALS</p>
        <h2>项目资料</h2>
        <p>图片、视频等完整资料统一收纳在百度网盘，面试时可直接打开查看。</p>
      </div>
      <div class="resource-action">
        <span>提取码：<strong>${escapeHtml(project.resource.password)}</strong></span>
        <a href="${escapeHtml(project.resource.url)}" target="_blank" rel="noreferrer">
          打开百度网盘资料 <span>↗</span>
        </a>
      </div>
    </div>

    <div class="media-heading">
      <div>
        <h2>项目图片与视频</h2>
        <p>把项目成果直观地展示给面试官</p>
      </div>
      <div class="media-actions">
        <button class="link-button" type="button" data-action="add-link">⌁ 添加链接</button>
        <button class="add-media" type="button" data-action="choose-media">＋ 选择本地文件</button>
      </div>
    </div>

    ${renderMedia(project)}
  `;

  mainArea.querySelector("[data-action='back']")?.addEventListener("click", () => {
    activeId = null;
    render();
  });
  mainArea.querySelectorAll("[data-action='choose-media']").forEach((button) => {
    button.addEventListener("click", () => mediaInput.click());
  });
  mainArea.querySelectorAll("[data-action='add-link']").forEach((button) => {
    button.addEventListener("click", () => openModal(mediaLinkModal));
  });
}

function render() {
  renderProjectList();
  renderMainArea();
}

document.querySelector("#newProjectButton").addEventListener("click", () => {
  openModal(newProjectModal);
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(document.querySelector(`#${button.dataset.close}`));
  });
});

[newProjectModal, mediaLinkModal].forEach((modal) => {
  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(newProjectModal);
    closeModal(mediaLinkModal);
  }
});

document.querySelector("#newProjectForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector("#projectTitle").value.trim();
  const description = document.querySelector("#projectDescription").value.trim();
  if (!title) return;
  const project = {
    id: Date.now(),
    title,
    description: description || "还没有填写项目介绍",
    focus: ["项目功能介绍", "实践过程记录", "成果资料整理"],
    resource: sharedResource,
    media: [],
  };
  projects.push(project);
  activeId = project.id;
  event.currentTarget.reset();
  closeModal(newProjectModal);
  render();
  showToast("项目已创建");
});

document.querySelector("#mediaLinkForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const project = getActiveProject();
  const url = document.querySelector("#mediaLinkUrl").value.trim();
  const kind = document.querySelector("#mediaLinkKind").value;
  if (!project || !url) return;
  project.media.push({ name: url, url, kind });
  event.currentTarget.reset();
  closeModal(mediaLinkModal);
  render();
  showToast("媒体链接已添加");
});

mediaInput.addEventListener("change", () => {
  const project = getActiveProject();
  if (!project || !mediaInput.files?.length) return;
  const additions = Array.from(mediaInput.files)
    .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
    .map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      kind: file.type.startsWith("video/") ? "video" : "image",
    }));
  project.media.push(...additions);
  mediaInput.value = "";
  render();
  showToast(`已添加 ${additions.length} 个媒体文件`);
});

render();

