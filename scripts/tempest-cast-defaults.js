const comingSoon = (slot, store) => ({
  slot,
  role: "Coming soon",
  name: "Coming soon",
  height: "",
  birthday: "",
  hobby: "",
  xUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  imagePosition: "image-pos-center",
  linkEnabled: false,
  visible: false,
  listImageUrl: "",
  profileImageUrl: ""
});

const cast = (store, slot, data) => ({
  slot,
  role: data.role || "Cast",
  name: data.name || "Coming soon",
  height: data.height || "",
  birthday: data.birthday || "",
  hobby: data.hobby || "",
  xUrl: data.xUrl || "",
  instagramUrl: data.instagramUrl || "",
  tiktokUrl: data.tiktokUrl || "",
  imagePosition: data.imagePosition || "image-pos-center",
  linkEnabled: data.linkEnabled !== false,
  visible: data.visible !== false,
  listImageUrl: `../assets/cast/${store}_${slot}.jpg`,
  profileImageUrl: `../assets/cast-profile/${store}_${slot}.jpg`
});

export const castDefaults = {
  various: [
    cast("various", "a", { role: "Manager", name: "ゆずは", height: "157cm", birthday: "12/13", hobby: "料理", xUrl: "https://x.com/1213_yuzuha?s=21", instagramUrl: "https://www.instagram.com/1213_yuzuha?igsh=MWxnZXAwZ2R1NndjOQ==", tiktokUrl: "https://www.tiktok.com/@yuzuha1213?_r=1&_t=ZS-97nkSrZzM8a" }),
    cast("various", "b", { name: "かおり(キャサリン･ボンバー)", height: "143cm", birthday: "9/30", hobby: "寝ること、ピアス", xUrl: "https://x.com/various_kaori?s=21", instagramUrl: "https://www.instagram.com/kaori.0930.kyuma?igsh=anNxeGJiNHAwNzg4", tiktokUrl: "https://www.tiktok.com/@kaori05302?_r=1&_t=ZS-97noXWyDBx6" }),
    cast("various", "c", { name: "aika", height: "156cm", birthday: "10/4", hobby: "お酒、人と話すこと", xUrl: "https://x.com/aika197163?s=21", instagramUrl: "https://www.instagram.com/aika22006?igsh=MWM3OWt0aXlsY2tjMg==", tiktokUrl: "https://www.tiktok.com/@aika_rively?_r=1&_t=ZS-97nocXLQMWT" }),
    cast("various", "d", { name: "もか", height: "153cm", birthday: "10/2", hobby: "歌う事、食べる事、オタ活", xUrl: "https://x.com/moca_coffee1002?s=21", instagramUrl: "https://www.instagram.com/moca.various1002?igsh=MWJzY3FmbXVuc3pm", tiktokUrl: "https://www.tiktok.com/@ukiuki_beshonen?_r=1&_t=ZS-97noowgtDmO" }),
    cast("various", "e", { name: "かいり", height: "159cm", birthday: "1/13", hobby: "酒", xUrl: "https://x.com/kairi_chan0113?s=21", instagramUrl: "https://www.instagram.com/rilxxq13?igsh=d3VmbTk0dmtiOXFz", tiktokUrl: "https://www.tiktok.com/@rilxxq0?_r=1&_t=ZS-97nozH38LNV" }),
    cast("various", "f", { name: "ゆう", height: "162cm", birthday: "7/31", hobby: "アニメ鑑賞、クレーンゲーム", xUrl: "https://x.com/yuu_va0731?s=21", instagramUrl: "https://www.instagram.com/0731.yuu?igsh=MW01enFkbzVpbzYzYw==" }),
    cast("various", "g", { name: "はるな", height: "150cm", birthday: "6/21", hobby: "Netflix、編み物", instagramUrl: "https://www.instagram.com/haru.ru621?igsh=MWkxeHVrcWZ0dDBpdQ==", tiktokUrl: "https://www.tiktok.com/@harunniconico?_r=1&_t=ZS-97noShxCHOG" }),
    cast("various", "h", { name: "はやて", height: "169cm", birthday: "9/19", hobby: "世界征服", xUrl: "https://x.com/byky8118?s=21", instagramUrl: "https://www.instagram.com/hanyanyanya.a?igsh=MW01MWNoaXM5ZXk5NA==", tiktokUrl: "https://www.tiktok.com/@hayate.various?_r=1&_t=ZS-97nopHfpBor" }),
    comingSoon("i", "various")
  ],
  solomon: [
    cast("solomon", "a", { role: "Manager", name: "りみ", birthday: "8/23", xUrl: "https://x.com/solomon_rimi08?s=21", instagramUrl: "https://www.instagram.com/solomon_rimi08?igsh=MXRsY256OXdldnBhdA==", tiktokUrl: "https://www.tiktok.com/@solomon_rimi0823?_r=1&_t=ZS-97nobVLSD4P" }),
    cast("solomon", "b", { role: "Reader", name: "れもん", xUrl: "https://x.com/solomon_remon?s=21", instagramUrl: "https://www.instagram.com/solomon_remon_?igsh=cWRhems1amN4aGdo", tiktokUrl: "https://www.tiktok.com/@miruki_ocl?_r=1&_t=ZS-97nohCRtRQa" }),
    cast("solomon", "c", { name: "あま", xUrl: "https://x.com/solomon_ama?s=21", instagramUrl: "https://www.instagram.com/solomon__ama?igsh=MWtwcGFsMXN6MHlpNA==", tiktokUrl: "https://www.tiktok.com/@ama_o_x?_r=1&_t=ZS-97noZqY8S6G" }),
    cast("solomon", "d", { name: "れい", xUrl: "https://x.com/solomon_reirei?s=21", instagramUrl: "https://www.instagram.com/solomon_reirei?igsh=czN4MmcwanJiMWh2", tiktokUrl: "https://www.tiktok.com/@ai4tell_01?_r=1&_t=ZS-97nolWnw1Gn" }),
    cast("solomon", "e", { name: "しの", xUrl: "https://x.com/solomon_sino?s=21", instagramUrl: "https://www.instagram.com/solomon_sino?igsh=MzIyazFiMGdtMm5u", tiktokUrl: "https://www.tiktok.com/@4ne_ss0?_r=1&_t=ZS-97np3IG4Erd" }),
    cast("solomon", "f", { name: "あおと", xUrl: "https://x.com/solomon_aoto?s=21", instagramUrl: "https://www.instagram.com/aocyann_various?igsh=d3Z3MWpqYW9keHAz" }),
    comingSoon("g", "solomon"), comingSoon("h", "solomon"), comingSoon("i", "solomon")
  ],
  lively: [
    cast("lively", "a", { role: "Manager", name: "そうた", height: "162cm", birthday: "2/9", hobby: "カラオケ、ゲーム", xUrl: "https://x.com/lively_souta?s=21", instagramUrl: "https://www.instagram.com/jun_fuuma?igsh=eXF1M2x2M2FyYmhx", tiktokUrl: "https://www.tiktok.com/@fuumajun?_r=1&_t=ZS-97nonAGNSM9" }),
    cast("lively", "b", { name: "ふうた", height: "169cm", birthday: "11/14", hobby: "パチスロ、散歩", xUrl: "https://x.com/maxbet1255963?s=21", tiktokUrl: "https://www.tiktok.com/@okomesan1114?_r=1&_t=ZS-97noem0TkLl" }),
    cast("lively", "c", { name: "ゆき", height: "196cm", birthday: "2/14", hobby: "瞑想", xUrl: "https://x.com/lively_yuki?s=11", instagramUrl: "https://www.instagram.com/_oyy_yyo_?igsh=bTFhdWNua2t1N3p5&utm_source=qr", tiktokUrl: "https://www.tiktok.com/@you0214.y?_r=1&_t=ZS-97nqBL0JJcC" }),
    cast("lively", "d", { name: "りお", height: "148cm", birthday: "10/23", hobby: "音楽、映画、ご飯", instagramUrl: "https://www.instagram.com/rio_rara23?igsh=MTl6a2RiZWJlbDkyeA==", tiktokUrl: "https://www.tiktok.com/@oriho0?_r=1&_t=ZS-97nogmbZFfp" }),
    cast("lively", "e", { name: "かな", height: "145cm", birthday: "5/21", hobby: "ダーツ", xUrl: "https://x.com/kanaaaaa82?s=21" }),
    comingSoon("f", "lively"), comingSoon("g", "lively"), comingSoon("h", "lively"), comingSoon("i", "lively")
  ],
  charme: [
    cast("charme", "a", { role: "Manager", name: "りみ", birthday: "8/23", xUrl: "https://x.com/solomon_rimi08?s=21", instagramUrl: "https://www.instagram.com/solomon_rimi08?igsh=MXRsY256OXdldnBhdA==", tiktokUrl: "https://www.tiktok.com/@solomon_rimi0823?_r=1&_t=ZS-97nobVLSD4P" }),
    cast("charme", "b", { name: "みるく", xUrl: "https://x.com/solomon_miru16?s=21", instagramUrl: "https://www.instagram.com/solomon_miru16?igsh=NHhtdm10M3N5emx1", tiktokUrl: "https://www.tiktok.com/@sioramen_?_r=1&_t=ZS-97non0xZrQT" }),
    cast("charme", "c", { name: "りく", xUrl: "https://x.com/charme_riku_921?s=21", instagramUrl: "https://www.instagram.com/charme_riku_921?igsh=cWoyNzd0Z2Nvc3hu", tiktokUrl: "https://www.tiktok.com/@charme_riku_921?_r=1&_t=ZS-97noYygagrN" }),
    cast("charme", "d", { name: "さくら", xUrl: "https://x.com/solomono_sakura?s=21", instagramUrl: "https://www.instagram.com/solomon_sakura?igsh=djBiNTF0dWw3MHVm" }),
    cast("charme", "e", { name: "まい", xUrl: "https://x.com/solomon__mai?s=21", instagramUrl: "https://www.instagram.com/solomon__mai?igsh=MWN5Y3pmc2poYTJqMA==" }),
    comingSoon("f", "charme"), comingSoon("g", "charme"), comingSoon("h", "charme"), comingSoon("i", "charme")
  ],
  strive: [
    cast("strive", "a", { role: "Manager", name: "あおい", xUrl: "https://x.com/aoi_strive?s=21", instagramUrl: "https://www.instagram.com/aoi_strive?igsh=aHgwb3UwOXJlaGF5", tiktokUrl: "https://www.tiktok.com/@aoi_strive?_r=1&_t=ZS-97noW1rCmQu" }),
    cast("strive", "b", { name: "なつ", height: "161cm", birthday: "5/10", hobby: "カラオケ", instagramUrl: "https://www.instagram.com/natsu_strive?igsh=MWpkNmI5NjgzYzhpbA==" }),
    cast("strive", "c", { name: "りず", height: "165cm", birthday: "12/27", hobby: "お菓子作り", instagramUrl: "https://www.instagram.com/liz_strive?igsh=MTF2Y3N1em92MmJ2" }),
    cast("strive", "d", { name: "める", height: "156cm", birthday: "1/9", hobby: "ゲーム、ライブ", xUrl: "https://x.com/meru_strive?s=21", instagramUrl: "https://www.instagram.com/meru_strive?igsh=emZuZWtyejM5MGh1" }),
    cast("strive", "e", { name: "すず", height: "160cm", birthday: "7/18", hobby: "ポーカー", xUrl: "https://x.com/suzu__cc?s=21", instagramUrl: "https://www.instagram.com/suzu_strive?igsh=NGYweDh0NDYyYnNy" }),
    cast("strive", "f", { name: "ちょも", height: "163.1cm", birthday: "10/24", hobby: "ビリヤード", instagramUrl: "https://www.instagram.com/chomo_strive?igsh=MWpwam1udHJxYWR0dw==" }),
    cast("strive", "g", { name: "るい" }),
    comingSoon("h", "strive"), comingSoon("i", "strive")
  ],
  ebichanchi: [
    cast("ebichanchi", "a", { role: "Manager", name: "えびちゃん", height: "172cm", birthday: "9/26", hobby: "イケメン観察", xUrl: "https://x.com/ruimamiya?s=21", tiktokUrl: "https://www.tiktok.com/@ebichandaaayo?_r=1&_t=ZS-97noixzygvE" }),
    cast("ebichanchi", "b", { name: "あんな", xUrl: "https://x.com/charme_riku?s=21", instagramUrl: "https://www.instagram.com/tsubaki.anna0214?igsh=MTYxYm95cHdma3A5ZQ==" }),
    cast("ebichanchi", "c", { name: "リュウイチ", height: "170cm", birthday: "1/11", hobby: "イケメン探し" }),
    cast("ebichanchi", "d", { name: "そーいち", height: "183cm", birthday: "3/1", hobby: "釣り、ゴルフ、酒" }),
    comingSoon("e", "ebichanchi"), comingSoon("f", "ebichanchi"), comingSoon("g", "ebichanchi"), comingSoon("h", "ebichanchi"), comingSoon("i", "ebichanchi")
  ]
};
