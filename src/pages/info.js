/**
 * Created by Leon Revill on 07/03/16.
 * Blog: http://www.revilweb.com
 * GitHub: https://github.com/RevillWeb
 * Twitter: @RevillWeb
 */
class InfoPage extends HTMLElement {
    createdCallback() {
        this.template = `<p>This is the contact page. <a href="#/">Home</a></p>`;
    }
    attachedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = this.template;
    }
}

window.customElements.define("info-page", InfoPage);