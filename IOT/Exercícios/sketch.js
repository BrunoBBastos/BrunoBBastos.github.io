let fotos = ['foto.jpg','foto2.jpg']
let iFoto = 0

function mudarFoto()
{
	iFoto++
	if (iFoto >= fotos.length)
	{
		iFoto = 0
	}
	document.getElementById("foto_banda").src = fotos[iFoto]
}