var DataTypes = require("sequelize").DataTypes;
var _administrador_polo = require("./administrador_polo");
var _album = require("./album");
var _alerta = require("./alerta");
var _authsso = require("./authsso");
var _avaliacao = require("./avaliacao");
var _categoria = require("./categoria");
var _chave = require("./chave");
var _cidade = require("./cidade");
var _comentario = require("./comentario");
var _comentarioresposta = require("./comentarioresposta");
var _denuncia = require("./denuncia");
var _departamento = require("./departamento");
var _destinatario = require("./destinatario");
var _distrito = require("./distrito");
var _evento = require("./evento");
var _ficheiro = require("./ficheiro");
var _formulario = require("./formulario");
var _formulariodetalhes = require("./formulariodetalhes");
var _formularioversao = require("./formularioversao");
var _funcao = require("./funcao");
var _grupo = require("./grupo");
var _idioma = require("./idioma");
var _itemavaliacao = require("./itemavaliacao");
var _itemcfgformulario = require("./itemcfgformulario");
var _itemcomentario = require("./itemcomentario");
var _itemrespostaformulario = require("./itemrespostaformulario");
var _mensagem = require("./mensagem");
var _notificacao = require("./notificacao");
var _objecto = require("./objecto");
var _participantes_eventos = require("./participantes_eventos");
var _perfil = require("./perfil");
var _polo = require("./polo");
var _pontointeresse = require("./pontointeresse");
var _respostadetalhe = require("./respostadetalhe");
var _respostaformulario = require("./respostaformulario");
var _sessao = require("./sessao");
var _subcategoria = require("./subcategoria");
var _subcategoria_fav_util = require("./subcategoria_fav_util");
var _thread = require("./thread");
var _traducao = require("./traducao");
var _utilizador = require("./utilizador");
var _utilizador_grupo = require("./utilizador_grupo");

function initModels(sequelize) {
  var administrador_polo = _administrador_polo(sequelize, DataTypes);
  var album = _album(sequelize, DataTypes);
  var alerta = _alerta(sequelize, DataTypes);
  var authsso = _authsso(sequelize, DataTypes);
  var avaliacao = _avaliacao(sequelize, DataTypes);
  var categoria = _categoria(sequelize, DataTypes);
  var chave = _chave(sequelize, DataTypes);
  var cidade = _cidade(sequelize, DataTypes);
  var comentario = _comentario(sequelize, DataTypes);
  var comentarioresposta = _comentarioresposta(sequelize, DataTypes);
  var denuncia = _denuncia(sequelize, DataTypes);
  var departamento = _departamento(sequelize, DataTypes);
  var destinatario = _destinatario(sequelize, DataTypes);
  var distrito = _distrito(sequelize, DataTypes);
  var evento = _evento(sequelize, DataTypes);
  var ficheiro = _ficheiro(sequelize, DataTypes);
  var formulario = _formulario(sequelize, DataTypes);
  var formulariodetalhes = _formulariodetalhes(sequelize, DataTypes);
  var formularioversao = _formularioversao(sequelize, DataTypes);
  var funcao = _funcao(sequelize, DataTypes);
  var grupo = _grupo(sequelize, DataTypes);
  var idioma = _idioma(sequelize, DataTypes);
  var itemavaliacao = _itemavaliacao(sequelize, DataTypes);
  var itemcfgformulario = _itemcfgformulario(sequelize, DataTypes);
  var itemcomentario = _itemcomentario(sequelize, DataTypes);
  var itemrespostaformulario = _itemrespostaformulario(sequelize, DataTypes);
  var mensagem = _mensagem(sequelize, DataTypes);
  var notificacao = _notificacao(sequelize, DataTypes);
  var objecto = _objecto(sequelize, DataTypes);
  var participantes_eventos = _participantes_eventos(sequelize, DataTypes);
  var perfil = _perfil(sequelize, DataTypes);
  var polo = _polo(sequelize, DataTypes);
  var pontointeresse = _pontointeresse(sequelize, DataTypes);
  var respostadetalhe = _respostadetalhe(sequelize, DataTypes);
  var respostaformulario = _respostaformulario(sequelize, DataTypes);
  var sessao = _sessao(sequelize, DataTypes);
  var subcategoria = _subcategoria(sequelize, DataTypes);
  var subcategoria_fav_util = _subcategoria_fav_util(sequelize, DataTypes);
  var thread = _thread(sequelize, DataTypes);
  var traducao = _traducao(sequelize, DataTypes);
  var utilizador = _utilizador(sequelize, DataTypes);
  var utilizador_grupo = _utilizador_grupo(sequelize, DataTypes);

  ficheiro.belongsTo(album, { as: "album", foreignKey: "albumid"});
  album.hasMany(ficheiro, { as: "ficheiros", foreignKey: "albumid"});
  subcategoria.belongsTo(categoria, { as: "categorium", foreignKey: "categoriaid"});
  categoria.hasMany(subcategoria, { as: "subcategoria", foreignKey: "categoriaid"});
  traducao.belongsTo(chave, { as: "chave", foreignKey: "chaveid"});
  chave.hasMany(traducao, { as: "traducaos", foreignKey: "chaveid"});
  evento.belongsTo(cidade, { as: "cidade", foreignKey: "cidadeid"});
  cidade.hasMany(evento, { as: "eventos", foreignKey: "cidadeid"});
  polo.belongsTo(cidade, { as: "cidade", foreignKey: "cidadeid"});
  cidade.hasMany(polo, { as: "polos", foreignKey: "cidadeid"});
  pontointeresse.belongsTo(cidade, { as: "cidade", foreignKey: "cidadeid"});
  cidade.hasMany(pontointeresse, { as: "pontointeresses", foreignKey: "cidadeid"});
  denuncia.belongsTo(comentario, { as: "comentario", foreignKey: "comentarioid"});
  comentario.hasMany(denuncia, { as: "denuncia", foreignKey: "comentarioid"});
  utilizador.belongsTo(departamento, { as: "departamento", foreignKey: "departamentoid"});
  departamento.hasMany(utilizador, { as: "utilizadors", foreignKey: "departamentoid"});
  mensagem.belongsTo(destinatario, { as: "destinatario", foreignKey: "destinatarioid"});
  destinatario.hasMany(mensagem, { as: "mensagems", foreignKey: "destinatarioid"});
  cidade.belongsTo(distrito, { as: "distrito", foreignKey: "distritoid"});
  distrito.hasMany(cidade, { as: "cidades", foreignKey: "distritoid"});
  participantes_eventos.belongsTo(evento, { as: "evento", foreignKey: "eventoid"});
  evento.hasMany(participantes_eventos, { as: "participantes_eventos", foreignKey: "eventoid"});
  formularioversao.belongsTo(formulario, { as: "formulario", foreignKey: "formularioid"});
  formulario.hasMany(formularioversao, { as: "formularioversaos", foreignKey: "formularioid"});
  respostadetalhe.belongsTo(formulariodetalhes, { as: "formulariodetalhe", foreignKey: "formulariodetalhesid"});
  formulariodetalhes.hasMany(respostadetalhe, { as: "respostadetalhes", foreignKey: "formulariodetalhesid"});
  formulariodetalhes.belongsTo(formularioversao, { as: "formularioversao", foreignKey: "formularioversaoid"});
  formularioversao.hasMany(formulariodetalhes, { as: "formulariodetalhes", foreignKey: "formularioversaoid"});
  utilizador.belongsTo(funcao, { as: "funcao", foreignKey: "funcaoid"});
  funcao.hasMany(utilizador, { as: "utilizadors", foreignKey: "funcaoid"});
  utilizador_grupo.belongsTo(grupo, { as: "grupo", foreignKey: "grupoid"});
  grupo.hasMany(utilizador_grupo, { as: "utilizador_grupos", foreignKey: "grupoid"});
  alerta.belongsTo(idioma, { as: "idioma", foreignKey: "idiomaid"});
  idioma.hasMany(alerta, { as: "alerta", foreignKey: "idiomaid"});
  pontointeresse.belongsTo(idioma, { as: "idioma", foreignKey: "idiomaid"});
  idioma.hasMany(pontointeresse, { as: "pontointeresses", foreignKey: "idiomaid"});
  thread.belongsTo(idioma, { as: "idioma", foreignKey: "idiomaid"});
  idioma.hasMany(thread, { as: "threads", foreignKey: "idiomaid"});
  traducao.belongsTo(idioma, { as: "idioma", foreignKey: "idiomaid"});
  idioma.hasMany(traducao, { as: "traducaos", foreignKey: "idiomaid"});
  utilizador.belongsTo(idioma, { as: "idioma", foreignKey: "idiomaid"});
  idioma.hasMany(utilizador, { as: "utilizadors", foreignKey: "idiomaid"});
  avaliacao.belongsTo(itemavaliacao, { as: "itemavaliacao", foreignKey: "itemavaliacaoid"});
  itemavaliacao.hasMany(avaliacao, { as: "avaliacaos", foreignKey: "itemavaliacaoid"});
  formulario.belongsTo(itemcfgformulario, { as: "itemcfgformulario", foreignKey: "itemcfgformularioid"});
  itemcfgformulario.hasMany(formulario, { as: "formularios", foreignKey: "itemcfgformularioid"});
  comentario.belongsTo(itemcomentario, { as: "itemcomentario", foreignKey: "itemcomentarioid"});
  itemcomentario.hasMany(comentario, { as: "comentarios", foreignKey: "itemcomentarioid"});
  respostaformulario.belongsTo(itemrespostaformulario, { as: "itemrespostaformulario", foreignKey: "itemrespostaformularioid"});
  itemrespostaformulario.hasMany(respostaformulario, { as: "respostaformularios", foreignKey: "itemrespostaformularioid"});
  album.belongsTo(objecto, { as: "objecto", foreignKey: "objectoid"});
  objecto.hasMany(album, { as: "albums", foreignKey: "objectoid"});
  utilizador.belongsTo(perfil, { as: "perfil", foreignKey: "perfilid"});
  perfil.hasMany(utilizador, { as: "utilizadors", foreignKey: "perfilid"});
  administrador_polo.belongsTo(polo, { as: "polo", foreignKey: "poloid"});
  polo.hasMany(administrador_polo, { as: "administrador_polos", foreignKey: "poloid"});
  alerta.belongsTo(polo, { as: "polo", foreignKey: "poloid"});
  polo.hasMany(alerta, { as: "alerta", foreignKey: "poloid"});
  utilizador.belongsTo(polo, { as: "polo", foreignKey: "poloid"});
  polo.hasMany(utilizador, { as: "utilizadors", foreignKey: "poloid"});
  respostadetalhe.belongsTo(respostaformulario, { as: "respostaformulario", foreignKey: "respostaformularioid"});
  respostaformulario.hasMany(respostadetalhe, { as: "respostadetalhes", foreignKey: "respostaformularioid"});
  grupo.belongsTo(subcategoria, { as: "subcategorium", foreignKey: "subcategoriaid"});
  subcategoria.hasMany(grupo, { as: "grupos", foreignKey: "subcategoriaid"});
  pontointeresse.belongsTo(subcategoria, { as: "subcategorium", foreignKey: "subcategoriaid"});
  subcategoria.hasMany(pontointeresse, { as: "pontointeresses", foreignKey: "subcategoriaid"});
  subcategoria_fav_util.belongsTo(subcategoria, { as: "subcategorium", foreignKey: "subcategoriaid"});
  subcategoria.hasMany(subcategoria_fav_util, { as: "subcategoria_fav_utils", foreignKey: "subcategoriaid"});
  thread.belongsTo(subcategoria, { as: "subcategorium", foreignKey: "subcategoriaid"});
  subcategoria.hasMany(thread, { as: "threads", foreignKey: "subcategoriaid"});
  administrador_polo.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(administrador_polo, { as: "administrador_polos", foreignKey: "utilizadorid"});
  album.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(album, { as: "albums", foreignKey: "utilizadorid"});
  alerta.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(alerta, { as: "alerta", foreignKey: "utilizadorid"});
  authsso.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(authsso, { as: "authssos", foreignKey: "utilizadorid"});
  avaliacao.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(avaliacao, { as: "avaliacaos", foreignKey: "utilizadorid"});
  comentario.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(comentario, { as: "comentarios", foreignKey: "utilizadorid"});
  denuncia.belongsTo(utilizador, { as: "utilizadorcriou_utilizador", foreignKey: "utilizadorcriou"});
  utilizador.hasMany(denuncia, { as: "denuncia", foreignKey: "utilizadorcriou"});
  denuncia.belongsTo(utilizador, { as: "utilizadormodera_utilizador", foreignKey: "utilizadormodera"});
  utilizador.hasMany(denuncia, { as: "utilizadormodera_denuncia", foreignKey: "utilizadormodera"});
  evento.belongsTo(utilizador, { as: "utilizadoraprovou_utilizador", foreignKey: "utilizadoraprovou"});
  utilizador.hasMany(evento, { as: "eventos", foreignKey: "utilizadoraprovou"});
  evento.belongsTo(utilizador, { as: "utilizadorcriou_utilizador", foreignKey: "utilizadorcriou"});
  utilizador.hasMany(evento, { as: "utilizadorcriou_eventos", foreignKey: "utilizadorcriou"});
  grupo.belongsTo(utilizador, { as: "utilizadorcriou_utilizador", foreignKey: "utilizadorcriou"});
  utilizador.hasMany(grupo, { as: "grupos", foreignKey: "utilizadorcriou"});
  mensagem.belongsTo(utilizador, { as: "remetente", foreignKey: "remetenteid"});
  utilizador.hasMany(mensagem, { as: "mensagems", foreignKey: "remetenteid"});
  notificacao.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(notificacao, { as: "notificacaos", foreignKey: "utilizadorid"});
  participantes_eventos.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(participantes_eventos, { as: "participantes_eventos", foreignKey: "utilizadorid"});
  pontointeresse.belongsTo(utilizador, { as: "utilizadoraprova_utilizador", foreignKey: "utilizadoraprova"});
  utilizador.hasMany(pontointeresse, { as: "pontointeresses", foreignKey: "utilizadoraprova"});
  pontointeresse.belongsTo(utilizador, { as: "utilizadorcriou_utilizador", foreignKey: "utilizadorcriou"});
  utilizador.hasMany(pontointeresse, { as: "utilizadorcriou_pontointeresses", foreignKey: "utilizadorcriou"});
  respostaformulario.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(respostaformulario, { as: "respostaformularios", foreignKey: "utilizadorid"});
  sessao.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(sessao, { as: "sessaos", foreignKey: "utilizadorid"});
  subcategoria_fav_util.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(subcategoria_fav_util, { as: "subcategoria_fav_utils", foreignKey: "utilizadorid"});
  thread.belongsTo(utilizador, { as: "utilizadoraprovou_utilizador", foreignKey: "utilizadoraprovou"});
  utilizador.hasMany(thread, { as: "threads", foreignKey: "utilizadoraprovou"});
  thread.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(thread, { as: "utilizador_threads", foreignKey: "utilizadorid"});
  utilizador_grupo.belongsTo(utilizador, { as: "utilizador", foreignKey: "utilizadorid"});
  utilizador.hasMany(utilizador_grupo, { as: "utilizador_grupos", foreignKey: "utilizadorid"});
  comentarioresposta.belongsTo(comentario, { as: "comentariopai", foreignKey: "comentariopaiid" });
  comentario.hasMany(comentarioresposta, { as: "respostas", foreignKey: "comentariopaiid" });
  comentarioresposta.belongsTo(comentario, { as: "resposta", foreignKey: "respostaid" });
  comentario.hasMany(comentarioresposta, { as: "comentariorepostas", foreignKey: "respostaid" });
  evento.belongsTo(subcategoria, { as: "subcategoria", foreignKey: "subcategoriaid" });
  subcategoria.hasMany(evento, { as: "eventos", foreignKey: "subcategoriaid" });

  return {
    administrador_polo,
    album,
    alerta,
    authsso,
    avaliacao,
    categoria,
    chave,
    cidade,
    comentario,
    comentarioresposta,
    denuncia,
    departamento,
    destinatario,
    distrito,
    evento,
    ficheiro,
    formulario,
    formulariodetalhes,
    formularioversao,
    funcao,
    grupo,
    idioma,
    itemavaliacao,
    itemcfgformulario,
    itemcomentario,
    itemrespostaformulario,
    mensagem,
    notificacao,
    objecto,
    participantes_eventos,
    perfil,
    polo,
    pontointeresse,
    respostadetalhe,
    respostaformulario,
    sessao,
    subcategoria,
    subcategoria_fav_util,
    thread,
    traducao,
    utilizador,
    utilizador_grupo,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
