const coreui_icons_href = "https://coreui.io/icons/"
const coreui_icons_github = "https://github.com/coreui/coreui-icons/"

const MENU_TOP = [
    // {
    //     'id': 'diag-new',
    //     'title': "New (in new tab)",
    //     'class': "cil-file-add",
    // },
    // {
    //     'id': 'diag-open',
    //     'title': "Open (from localStorage)",
    //     'class': "cil-folder-open",
    // },
    // {
    //     'id': 'diag-save',
    //     'title': "Save (to localStorage)",
    //     'class': "cil-save",
    // },

    // {'class': 'spacer'},

    // {
    //     'id': 'cut',
    //     'title': "Cut [Ctrl-X]",
    //     'class': "cil-cut",
    // },
    // {
    //     'id': 'copy',
    //     'title': "Copy [Ctrl-C]",
    //     'class': "cil-copy",
    // },
    // {
    //     'id': 'paste',
    //     'title': "Paste [Ctrl-P]",
    //     'class': "cil-clipboard",
    // },
    // {
    //     'id': 'undo',
    //     'title': "Undo [Ctrl-Z]",
    //     'class': "cil-action-undo",
    // },
    // {
    //     'id': 'redo',
    //     'title': "Redo [Ctrl-Z]",
    //     'class': "cil-action-redo",
    // },

    // {
    //     'id': 'text',
    //     'title': "Text/Select (default mode)",
    //     'class': "cil-text-shapes"
    // },
    // {
    //     'id': 'brush',
    //     'title': "Brush Mode",
    //     'class': "cil-brush-alt"
    // },

    // {'class': 'spacer'},

    // {
    //     'id': 'render-refresh',
    //     'title': "",
    //     'class': "cil-reload",
    // },
    // {
    //     'id': 'render-auto_on',
    //     'title': "",
    //     'class': "cil-toggle-on",
    // },
    // {
    //     'id': 'auto-render_off',
    //     'title': "",
    //     'class': "cil-toggle-off",
    // },

    // {
    //     'id': 'pan',
    //     'title': "",
    //     'class': "cil-camera-control"
    // },

    // {'class': 'spacer'},

    // {
    //     'id': 'zoom-in',
    //     'title': "Zoom In [Ctrl-Plus]",
    //     'class': "cil-zoom-in"
    // },
    // {
    //     'id': 'zoom-out',
    //     'title': "Zoom Out [Ctrl-Minus]",
    //     'class': "cil-zoom-out"
    // },

    // TODO
    // {
    //     'id': 'mode_switch',
    //     'title': "",
    //     'class': "cil-contrast"
    // },
    // {
    //     'id': 'mode_dark',
    //     'title': "",
    //     'class': "cil-moon"
    // },
    // {
    //     'id': 'mode_light',
    //     'title': "",
    //     'class': "cil-sun"
    // },

    // {
    //     'id': 'layers',
    //     'title': "",
    //     'class': "cil-layers"
    // },
    // {
    //     'id': 'layer_up',
    //     'title': "",
    //     'class': "cil-arrow-thick-from-bottom"
    // },
    // {
    //     'id': 'layer_down',
    //     'title': "",
    //     'class': "cil-arrow-thick-from-top"
    // },

    // {'class': 'spacer'},

    {
        'id': 'diag-share',
        'title': "Shareable URL",
        'class': "cil-share",
        'wrapNode': function (itemNode) {
            const anchorNode = document.createElement("a")
            anchorNode.href = document.location.href.split("#")[0].split("?")[0]
            anchorNode.appendChild(itemNode)
            return anchorNode
        },
    },

    // {
    //     'id': 'donate',
    //     'title': "Support with Bitcoin",
    //     'class': "cib-btc"
    // },

    {
        'id': 'gitlab',
        'title': "gitlab.com/mbarkhau/asciigrid",
        'class': "cib-gitlab",
        'wrapNode': function (itemNode) {
            const anchorNode = document.createElement("a")
            anchorNode.href = "https://gitlab.com/mbarkhau/asciigrid/"
            anchorNode.appendChild(itemNode)
            return anchorNode
        },
        'action': function(e) {
            if (e.button) {return}
            window.open("https://gitlab.com/mbarkhau/asciigrid/")
        },
    },

    // {
    //     'id': 'about',
    //     'title': "About",
    //     'class': "cil-info",
    //     'action': function() {
    //         console.log("show about")
    //     }
    // },

]

const MENU_LEFT = [
]

export function init() {
    function itemAppender(menuNode) {
        return (item) => {
            var itemNode = document.createElement("span")
            itemNode.id = item.id
            itemNode.classList.add(item.class)
            itemNode.title = item.title
            if (item.id == 'layers') {
                itemNode.classList.add("disabled")
            }
            if (item.wrapNode) {
                itemNode = item.wrapNode(itemNode)
            }
            itemNode.addEventListener('mousedown', item.action)
            itemNode.addEventListener('touchstart', item.action)
            menuNode.appendChild(itemNode)
        }
    }

    const menuTopNode = document.getElementById("menu-top")
    const menuLeftNode = document.getElementById("menu-left")
    MENU_TOP.forEach(itemAppender(menuTopNode))
    MENU_LEFT.forEach(itemAppender(menuLeftNode))
    menuLeftNode.style.display = "none"
}

export function updateShareURL(newFragment) {
    var anchorNode = document.getElementById('diag-share').parentNode
    anchorNode.href = document.location.href.split("#")[0] + "#" + newFragment
}
