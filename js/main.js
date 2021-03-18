/**
 * @author naohito tanaka
 * @version  0.1
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
 *
 *
 */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    "use strict";
    // varだとエラーになる。なぜ？ ↑のuse strictか
    const name = document.getElementById("name_id"); // お名前
    const nameKana = document.getElementById("name_kana"); // 名前カナ
    // let birthDay1 = document.form1.bday_year.options[document.form1.bday_year.selectedIndex].value; HTMLDocumentが取れるためeventListener無理
    const birthYear = document.form1.bday_year; // 年
    const birthMonth = document.form1.bday_month; // 月
    const birthDay = document.form1.bday_day; // 日
    const mail = document.getElementById("mail"); // mail
    const reMail = document.getElementById("re_mail"); // 再mail
    const tel = document.getElementById("phone_number"); // 電話番号(ハイフン無に変換)
    const postcal_code = document.getElementById("postcal_code"); // 郵便番号
    const nameCheck = /^[\Wぁ-んァ-ン一-龠]+?/; // 正規表現 ひらがな・カタカナ・漢字 一-龠 = システム的にご作動があるらしい
    const nameKanaCheck = /^[\u{3000}-\u{301C}\u{30A1}-\u{30F6}\u{30FB}-\u{30FE}]+$/mu; // 正規表現 カタカナのみ UTF-16で対応
    const mailCheck = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/; // 正規表現mail

    // 名前確認
    name.addEventListener(
      "change",
      (e) => {
        // 値がなかった場合に、デフォルトで設定してあるエラーメッセージを入れるなどできそう。
        let str = e.target.value;
        let errorSpan = document.getElementsByClassName("error-message")[0];
        if (nameCheck.test(str)) {
          errorSpan.style.display = "none";
        } else {
          errorSpan.style.display = "inline";
        }
      },
      true
    );
    // 名前カナ確認
    nameKana.addEventListener(
      "change",
      (e) => {
        let str = e.target.value;
        let errorSpan = document.getElementsByClassName("error-message")[1];
        if (nameKanaCheck.test(str)) {
          errorSpan.style.display = "none";
        } else {
          errorSpan.style.display = "inline";
        }
      },
      false
    );

    /**
     * @author naohito tanaka
     * @description 日付関数メソッド
     *
     *
     */
    let observer = new MutationObserver(() => {
      if (birthYear.value && birthMonth.value && birthDay.value) {
        // nullの場合はfalseと判定されるJs仕様
        console.log("成功");
      } else {
        console.log("失敗");
      }
    });
    let elem = document.getElementById("select_box");
    const config = {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    };
    observer.observe(elem, config);

    function ValidDate(y, m, d) {
      dt = new Date(y, m - 1, d);
      return (
        dt.getFullYear() == y && dt.getMonth() == m - 1 && dt.getDate() == d
      );
    }
    /**
     * @author naohito tanaka
     * @description メールアドレスをチェックします。
     *
     *
     */
    mail.addEventListener(
      "change",
      (e) => {
        let errorSpan = document.getElementsByClassName("error-message")[2];
        let str = e.target.value;
        if (mailCheck.test(str)) {
          if (re_mail.value) {
            // 再メールフォームに値がセットされているか ''はfalseと判定されるjs仕様
            if (str == re_mail.value) {
              // 再メールフォームと値が同じが
              let errorSpan = document.getElementsByClassName(
                "error-message"
              )[3];
              errorSpan.style.display = "none";
            } else {
              let errorSpan = document.getElementsByClassName(
                "error-message"
              )[3];
              errorSpan.style.display = "inline";
            }
          }
          errorSpan.style.display = "none"; // メールアドレスの形式はあっているけど相手の値がまだセットされていない。
        } else {
          errorSpan.style.display = "inline";
        }
      },
      false
    );

    reMail.addEventListener(
      "change",
      (e) => {
        let str = e.target.value;
        let errorSpan = document.getElementsByClassName("error-message")[4];
        if (mailCheck.test(str)) {
          if (mail.value) {
            // メールフォームに値がセットされているかつメールフォームと値が同じか
            if (str == mail.value) {
              let errorSpan = document.getElementsByClassName(
                "error-message"
              )[5];
              errorSpan.style.display = "none";
            } else {
              let errorSpan = document.getElementsByClassName(
                "error-message"
              )[5];
              errorSpan.style.display = "inline"; // メールアドレスが双方で違う
            }
          }
          errorSpan.style.display = "none"; // メールアドレスの形式はあっているけどよい
        } else {
          errorSpan.style.display = "inline"; // メールアドレスの形式が違うエラー
        }
      },
      false
    );
    /**
     * @author naohito tanaka
     * @description 電話番号確認メソッド
     * @param    tel.value
     * @return   tel.value(全角なら半角へ変換した数字)
     */
    tel.addEventListener(
      "change",
      (e) => {
        let num = e.target.value.replace(/[━.*‐.*―.*－.*\-.*ー.*\-]/gi, ""); //ハイフンは空にしてから正規表現に通す
        let errorSpan = document.getElementsByClassName("error-message")[6];
        if (numericCheck(num)) {
          let str = strHalfConversion(num);
          console.log(str);
          tel.value = str;
          errorSpan.style.display = "none";
        } else {
          errorSpan.style.display = "inline";
        }
      },
      false
    );
    /**
     * @author naohito tanaka
     * @description 電話番号確認メソッド
     * @param    postcal_code
     * @return   郵便番号から検索された住所
     */

    postcal_code.addEventListener("change", (e) => {
      let tar = strHalfConversion(e.target.value);
      // XMLHttpRequetのインスタンスを作成
      var req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.response);
        }
      };
      req.open(
        "GET",
        "http://zipcloud.ibsnet.co.jp/api/search?zipcode=" + tar,
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
    /**
     * @author naohito tanaka
     * @description 数字のみ確認
     * @param       ハイフン無しの全角数字or半角数字
     * {n} で「連続n回の出現」を意味 '98765' という「数字5個」に \d{3} がマッチする。 文字列全体では数字5個ですが、 '987'
     */
    function numericCheck(num) {
      return num.match(/^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/)
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
     * @description 全角(英数字)→→半角(英数字)
     * 文字コード上で、全角英数字から65248引くと半角英数字になります。
     * また、処理範囲を正規表現で[Ａ-Ｚａ-ｚ０-９]と指定していますが、例えば[０-９]とすれば、変換対象を全角数字に限定できます
     * 全角英数の文字コードから65248個前が半角英数の文字コードとなっているため文字コードから65248引いて変換する。
     * 置換対象を以下とする
     * 大文字ローマ時
     * 小文字ローマ時
     * 全角数字
     */
    //    function strHalfConversion(str) {
    //        return str.replace(/[A-Za-z０-９]/g, s => {
    //           return String.fromCharCode(s.charCodeAt(0) - 65248); // 10進数の場合
    //        });
    //    }
    // ES6へ変換
    const strHalfConversion = (str) => {
      str.replace(/[A-Za-z０-９]/g, (s) => {
        String.fromCharCode(s.charCodeAt(0) - 65248);
      });
    };
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
    //     document.onkeypress = enter;
    //     function enter(){
    //     if( window.event.keyCode == 13 ){
    //     return false;
    //       }
    //     }              // ↓↓ES6に変換
    // ES6に変換
    // ?は条件 (三項) 演算子という
    // JavaScript では唯一の、3 つのオペランドをとる演算子
    document.onkeypress = () => (window.event.keyCode !== 13 ? true : false);
  },
  false
);
