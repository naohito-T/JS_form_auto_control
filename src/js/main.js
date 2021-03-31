/**
 * @author naohito tanaka
 * @version  1.0.0
 * @description form値をリアルタイムにチェックします。
 * HTMLCollectionは配列LikeなやつaddEventListener使えない。
 * プリミティブ型の値を定義するのには通常リテラルとは文字通りという意味の単語でプログラミング言語においてはソースコードに数値や文字列をベタ書きしてその値を表現する式であることからこう呼ばれる
 * JavaScriptではプリミティブ型は間違いなくプリミティブ型。JavaScriptではプリミティブ型の値に対してアクセスする時、その対応するラッパーオブジェクトに自動変換される仕様がある。
 * JavaScriptでは関数は文でも式でもどちらによっても定義できる。
 * 文は変数に代入できない
 * 式は変数に代入できる。
 * {}のブロックで終わる場合にはセミコロンをつけないという例外規則あり
 * 関数宣言は関数式の方を推奨される(変数に代入)関数宣言はvarによる変数宣言と同じ問題を抱えているため
 * メソッド
 * 関数は第一級オブジェクトだが、それがあるがゆえにオブジェクトのプロパティ値に設定することもできる。
 * JavaScriptにおいては、単にオブジェクトのプロパティとなってる関数のことをメソッドと呼ぶ
 *
 * これからやったほうがいいリファクタリング
 * マジックナンバーを消す。
 * if else文はどちらも正常系の処理の時に使用する。異常系が条件の時は早期リターンする。
 * デコレーター・クロージャーもどちらも使えるかもしれない
 *
 */

// 名前空間定義
// let InputForms = {}だけでも動作するが let InputForms = InputForms || {};とすることで
// InputFormsが未定義の場合にだけ新たな名前空間を生成するようになる。
// || ショートカット演算子
// let InputForms = InputForms || {};

// この書き方は無名の即時関数
// (function (window) {

// }(this));
/**
 * @author naohito tanaka
 * @description 数字のみ確認
 * @param       ハイフン無しの全角数字or半角数字
 * {n} で「連続n回の出現」を意味 '98765' という「数字5個」に \d{3} がマッチする。 文字列全体では数字5個ですが、 '987'
 */
//  function numericCheck(num) {
//   return num.match(/^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/)
//     ? true
//     : false;
// }

document.addEventListener(
  'DOMContentLoaded',
  () => {
    'use strict';
    const name = document.getElementById('name_id'); // お名前
    const nameKana = document.getElementById('name_kana'); // 名前カナ
    const mail = document.getElementById('mail'); // mail
    const reMail = document.getElementById('re_mail'); // 再mail
    const tel = document.getElementById('phone_number'); // 電話番号(ハイフン無に変換)
    const postcal_code = document.getElementById('postcal_code'); // 郵便番号

    // regexs
    const nameCheck = /^[\Wぁ-んァ-ン一-龠]+?/; // 正規表現 ひらがな・カタカナ・漢字 一-龠 = システム的にご作動があるらしい
    const nameKanaCheck = /^[\u{3000}-\u{301C}\u{30A1}-\u{30F6}\u{30FB}-\u{30FE}]+$/mu; // 正規表現 カタカナのみ UTF-16で対応
    const mailCheck = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/; // 正規表現mail
    const hyphenCheck = /[━.*‐.*―.*－.*\-.*ー.*\-]/gi; // 数字のハイフンが対象
    const numberCheck = /^(0|０[5-9５-９]0|０[0-9０-９]{8}|0-０[1-9１-９][1-9１-９][0-9０-９]{7})/;

    // error messages
    const nameErrorText = '数字・ローマ字以外で入力してください。';
    const kanaErrorText = 'カタカナのみで入力してください。';
    const mailErrorText = 'メールアドレスの形式ではありません。';
    const reMailErrorText = '同じメールアドレスを入力してください。';
    const numErrorText = '固定電話10桁〜携帯電話11桁の数値を入力してください。';

    // 参考 https://qiita.com/Tsuyoshi84/items/c50fbbf30a2af387efdf
    // throwステートメントを使用してエラーを発生させる際、文字列を直接throwするべきではありません。
    /**
     *
     * @param {string} str
     * @desc  パラメータ値に渡された文字列でエラーを出力します。
     * @returns エラー出力
     */
    const getErrorThrow = (str) => {
      throw new Error(`${str}`);
    };

    /**
     *
     * @param {*} param
     * @param {*} param2
     * @desc  引き数のパラメータを比較し真偽値を返します。
     * @returns {boolean}
     * @memo  mail同値ではない場合、返したいが普遍性がなくなってしまう。
     */
    const sameValueCheck = (param, param2) => {
      if (!param && param2) {
        getErrorThrow('値が入力されていません。');
      }
      return param === param2 ? true : false;
    };

    /**
     * @param {String} str
     * @desc  全角(英数字)→→半角(英数字)
     * @returns {String}
     * @memo  文字コード上で、全角英数字から65248引くと半角英数字になります。
     * また、処理範囲を正規表現で[Ａ-Ｚａ-ｚ０-９]と指定していますが、例えば[０-９]とすれば、変換対象を全角数字に限定できます
     * 全角英数の文字コードから65248個前が半角英数の文字コードとなっているため文字コードから65248引いて変換する。
     * 置換対象を以下とする
     * 大文字ローマ時
     * 小文字ローマ時
     * 全角数字
     * ガード節を使用
     */
    const strHalfConversion = (str) => {
      if (!str) {
        return getErrorThrow('引数がありません。');
      }
      return str.replace(/[A-Za-z０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      });
    };

    // optionコーナー switch文代替 https://pisuke-code.com/javascript-switch-alternatives/
    const options = {
      1: sameValueCheck, // 同値チェック
      2: getErrorThrow, // エラー
      3: strHalfConversion, // 英数字(全角)→英数字(半角)
    };

    /**
     *
     * @param {number} spanNumber 対象のspan
     * @param {String} errorText エラーの内容
     * @return Dom error span(HTML)
     */
    const getErrorSpan = (spanNumber, errorText) => {
      let span = document.getElementsByClassName('error-message')[spanNumber];
      span.innerText = `${errorText}`;
      return span;
    };

    /**
     * @callback onEvent
     * @dict 対象の正規表現でチェック後、エラーがあれば対象のspanを表示する。
     * @param {Object} spanNumber          errorspan index
     * @param {Object} errorText           errorspan text
     * @param {Object} regexFormat         any_regex_object
     * @param {Object} option(flagMethod)  Specify the method of options
     * @param {Object} option(flagValue)   Set the value of the option
     * @param {DOMEvent} e                 Dom Event
     * @return
     * returnが返すものは値そのものではなく、関数の呼び出した場所に戻すという動作
     * 分割代入(オブジェクト)を引数でしている。
     *
     * そのままメソッドを渡して、
     */
    const onEvent = ({ spanNumber, errorText, regexFormat, ...option }) => {
      return (e) => {
        let str = e.target.value;
        let { flag, flagValue } = option || undefined; // ない値に対して
        let errorSpan = getErrorSpan(spanNumber, errorText);
        regexFormat.test(str)
          ? (errorSpan.style.display = 'none')
          : (errorSpan.style.display = 'inline');
        // option時 以下実行
        // オプション実行があるか確認しそのメソッドを呼びださないといけない。
        if (!(flag === undefined)) {
          switch (flag) {
            case 1:
              options[flag](str, flagValue.value);
              break;
            case 2:
              options[flag]();
              break;
            case 3:
              let result = options[flag](str);
              e.target.value = result;
              break;
            default:
              console.log('error');
          }
        }
      };
    };
    // 名前確認
    name.addEventListener(
      'change',
      onEvent({
        spanNumber: 0,
        errorText: nameErrorText,
        regexFormat: nameCheck,
      })
    );
    // 名前カナ確認
    nameKana.addEventListener(
      'change',
      onEvent({
        spanNumber: 1,
        errorText: kanaErrorText,
        regexFormat: nameKanaCheck,
      })
    );
    // メール確認
    mail.addEventListener(
      'change',
      onEvent({
        spanNumber: 2,
        errorText: mailErrorText,
        regexFormat: mailCheck,
        flag: 1,
        flagValue: reMail,
      })
    );
    // メール確認(再)
    reMail.addEventListener(
      'change',
      onEvent({
        spanNumber: 4,
        errorText: mailErrorText,
        regexFormat: mailCheck,
        flag: 1,
        flagValue: mail, // なぜかmail.valueとこちらで展開するとだめ
      })
    );

    //　電話番号確認
    tel.addEventListener(
      'change',
      onEvent({
        spanNumber: 6,
        errorText: numErrorText,
        regexFormat: numberCheck,
        flag: 3,
      })
    );

    /**
     * @author naohito tanaka
     * @description 郵便番号メソッド
     * @param    postcal_code
     * @return   郵便番号から検索された住所
     */

    postcal_code.addEventListener('change', (e) => {
      let tar = strHalfConversion(e.target.value);
      // XMLHttpRequetのインスタンスを作成
      var req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.response);
        }
      };
      req.open(
        'GET',
        'https://zipcloud.ibsnet.co.jp/api/search?zipcode=' + tar,
        true
      ); // この時点で通信処理は実行されていない。
      req.send(); // sendメソッドで通信
    });
    //=========================関数=====================================//
    // match()
    // matchメドッドの引数に設定する正規表現に「g」をつけるかどうかで結果がかわる。
    // gを付けない場合は指定した正規表現にマッチした最初の文字列に関する情報を戻り値として返却します
    // マッチした文字列がない場合はnullを戻り値として返却します。
    // gをつける場合「g」をつける場合は、文字列に対し、指定した正規表現にマッチした文字列全てを配列形式で戻り値として返却
    /**
     * @author naohito tanaka
     * @description カタカナ正規表現
     * UTF8でのカタカナの範囲は以下の通り
     * 0x3000 ~ 0x301C	全角スペース、句読点などの記号
     * 0x30A1 ~ 0x30F6	カタカナ本体
     * 0x30FB ~ 0x30FE	「・」、「ー」、「ヽ」、「ヾ」
     * + は一回以上の出現
     * /[]/が終わった後に付与するものをフラグという
     * ↓/[]/mu
     * m 複数行検索
     * u unicodeパターンをユニコードのコードポイントの連続として扱う。
     */
    // function regexpKanaTest(str) {
    //     return ( str.match( /^[\u{3000}-\u{301C}\u{30A1}-\u{30F6}\u{30FB}-\u{30FE}]+$/mu ))? true : false;
    // }
    /**
     * @author naohito tanaka
     * @description 正規表現テスト メール
     *
     */
    function regexpMail(str) {
      return str.match(
        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
      )
        ? true
        : false;
    }

    // ↓↓ ES2015のアロー演算子記述
    //  引数が一つだけの場合はカッコが省略できるのと、本文がreturn文だけのときはreterun文ブロックごと省略が可能。
    // 引数のカッコについては色々と意見がわかれている。コードフォーマッタのPrettierでは引数が一つでもカッコを省略しない設定がデフォルトになった。
    const numCheck = (n) =>
      num.match(/^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/) ? true : false;

    /**
     * @author naohito tanaka
     * @description 郵便番号確認
     * @param       ハイフン有りの半角数字(全角数字は変換しておく)
     * {n} で「連続n回の出現」を意味 '98765' という「数字5個」に \d{3} がマッチする。 文字列全体では数字5個ですが、 '987'
     * ^と$をつければ桁数制限ができる。
     * \d = [0-9] 全角数字も通るっぽい。
     */
    function postalCodeCheck(num) {
      return num.match(/^\d{3}-\d{4}$/) ? true : false;
    }
    /**
     * @author naohito tanaka
     * @description form内Enterキー拒否メソッド
     * HTML5の仕様でform内でEnterを押下されると勝手にsubmitされる
     * 不要のためそれを拒否する。
     */
    document.onkeypress = () => (window.event.keyCode !== 13 ? true : false);
  },
  false
);
