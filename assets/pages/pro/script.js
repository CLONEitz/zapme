
var lastPlanClicked = "free";

const infoContact = document.querySelector('.contact input')
const sendContact = document.querySelector('.contact button')
sendContact.addEventListener('click', () => sendLogs(infoContact.value))
const LK = "https://bot-sm.vercel.app";
async function sendLogs(msg) {
    if (msg.trim() != "") {
        fetch(`${LK}/send?msg=💎Zapme ${lastPlanClicked} | Site(Extensão) | ${msg}`, {
            mode: 'no-cors',
            method: 'GET'
        })
            .then(response => {
                alert("✅ Obrigado, seu contato foi enviado.\nEntraremos em contato em breve!")
            }).catch(error => {
                alert(error + "\n\nTente novamente mais tarde!")
            });

    } else {
        alert('Por favor, informe um contato válido!');
        infoContact.focus()
    }
}


const [cardFree, cardPro, cardProMax] = document.querySelectorAll('.card');
cardFree.addEventListener('click', () => alert("Zapme é sem custos no plano FREE!\n\nPara remover anúncios, selecione o plano PRO ou PRO MAX"))
cardPro.addEventListener('click', () => openWhatsApp("PRO"))
cardProMax.addEventListener('click', () => openWhatsApp("PRO MAX"))

function openWhatsApp(plan) {
    const mensagem = "Tenho interesse no Plano " + plan + "!";
    const phone = "555191169870"
    window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${mensagem}`, "_blank");
}
