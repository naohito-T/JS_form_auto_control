# JS form auto control

## Descripton

クライアントサイドでの検索欄のチェック機能を提供します。

## DEMO

"hoge"の魅力が直感的に伝えわるデモ動画や図解を載せる

## Features

"hoge"のセールスポイントや差別化などを説明する

## Requirement

"hoge"を動かすのに必要なライブラリなどを列挙する

- huga 3.5.2
- hogehuga 1.0.2

## Installation

Requirement で列挙したライブラリなどのインストール方法を説明する

```bash
pip install huga_package
```

## Usage

DEMO の実行方法など、"hoge"の基本的な使い方を説明する

```bash
git clone https://github.com/hoge/~
cd examples
python demo.py
```

# Note

注意点などがあれば書く

# Author

作成情報を列挙する

- 作成者
- 所属
- E-mail

# License

ライセンスを明示する

"hoge" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).

社内向けなら社外秘であることを明示してる

"hoge" is Confidential.

## 要件

お問い合わせ form 要件定義
■ 概要
サーバサイドでチェックを行うと、送信を押下してからでないとエラーが確認できない。
そのため、素の Js を使用しリアルタイムにチェックをする機能を作成してみようかと思う。
■ 最高のフォーム
https://www.sukerou.com/2020/03/blog-post_26.html
■JSDoc
https://sterfield.co.jp/designer/jsdoc-%E3%81%A7-javascript-%E3%81%AE%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%92%E6%9B%B8%E3%81%93%E3%81%86/
■JS 正規表現表
https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions

============必要な項目================

**名字 名前**
**カナ カナ**
**生年月日**
**メルアド**
**メルアド再入力**
**電話番号**
**郵便番号**
**住所**
**お問い合わせ内容**
**利用規約**
**送信ボタン**
**HTML5 の仕様で form 内で enter を押下すると勝手に submit されるためそれを拒否する。**

===========必要な技術===============

HTML
CSS
Js
JsDOM
取得方法参考 URL https://develop.logical-studio.com/web/20191213-js-class-addeventlistener/
正規表現

=============HTML について===============
■input タグ
name 属性
value 属性
placeholder 属性 初期値を表示
required 属性 必ず入力してほしいやつにつける。入力していないのであれば注意喚起を促してくれる required="true" or 列挙のため required を設定すればよい

■label タグ
label タグの書き方は 2 種類ある。

1. labele タグで挟む方法
   `<label><input type="text" name="hello" />男</label>`
2. for 属性を使う方法
   ` <label for="text_id">名前:</label><input type="text" name="name" id="text_id" />`

#### 2.は id で紐付ける方法のためやめておく。js だけに使用するという理念に使用。

■input タグ
設定する属性
type
name
autocomplete
placeholder
required

参考資料

今どきの form 作成方法 https://ics.media/entry/11221/
生年月日はどの入力欄がよいか form https://parashuto.com/rriver/development/implement-responsive-date-picker

JavaScript validationCheck 要件定義

前提条件
サーバでチェックするより、送信前に確認するほうがユーザリビティが上がると判断したため

必要スキル
Js
Js(DOM)

チェック項目
空白か確認
名前に英語やローマ字が含まれていないか(今回は日本語のみの対応のため)
メルアド再入力が同値か確認(@がないかあるかは submit 送信の際に判明するためよいとみなす)
電話番号
まず数字が入力されているか確認する
・数字の数は決まっているのであれば数字の数確認しチェック
郵便番号
・郵便番号から住所選択できるツール導入
→ その際に正確な郵便番号かチェックをする。

余裕があれば
生年月日が正確な日付なのか確認(うるう年などでない日付などもある。また今回はドロップリストでユーザに入力させているため)

■addEventListener
端的に述べれば、addEventListener は単一ノードのみに適用可能な関数であり、複数ノードである HTMLCollection には適用できないからです。
sections_a の中の要素ノードを参照して下さい。

■ フォームイベント
input 入力中に随時発生
change 入力が完了してフォーカスが外れたときに発生

=============メソッドでの個別要件=====================

■ 名前メソッド
要件
漢字とひらがなは通す
スペース入れても入れなくても通す
漢字正規表現参考
https://stabucky.com/wp/archives/7594

参考
https://pisuke-code.com/js-check-hira-kana-kanzi/

■ 名前カナメソッド
要件
全角・半角許容する
濁点と丸など許容する。

■ 日付メソッド
日付に関しては select とオプションを使い、表示させた。
ただ全てを表示しているためうるう年が振り分けれるかチェックをしたい。
参考 URL
https://kantaro-cgi.com/blog/javascript/javascript_date_check.html
また年・月・日がそれぞれ select と option で分けれてるためこれが大変
→ うるう年が全て選択していないとチェックできないため
→ そのためまずは全て選択済みなのかをチェックしそれで全ての値を取得する方向で攻める
参考 URL
選択 1
https://lab.syncer.jp/Web/JavaScript/Snippet/32/
選択 2
https://www.tagindex.com/javascript/form/check6.html

日付メソッドは以下
メソッド参考
https://kantaro-cgi.com/blog/javascript/javascript_date_check.html

これで大方完成だが、select が 3 つあるためこれを全て選択された場合のイベントの発火に困った。
→ 一つひとつにイベントリスナーつけてもいいが煩雑
そこでその select 群を囲んでいる div が変更あればいいということで判断した。
しかし change イベントは form 内にしか発生しない
そこで調べるといい値を発見
https://pisuke-code.com/mutation-observer-usage/

■ メールアドレスチェックメソッド
メールアドレスの要件は以下の通り
[英数字+記号]@[ドメイン]
許容
.-\_@
参考 URL
https://techacademy.jp/magazine/33601

■ 電話番号メソッド
要件
ハイフンあり無しどちらも対応できるようにする。
→ 取得したのを結局ハイフンを取り除いているだけ
全角も許容する。
→ 半角へ変換しテキストを流しこむ
全角を半角へ参考 URL
https://www.yoheim.net/blog.php?q=20191101
桁数を制限する(電話番号の桁数)と電話番号正規表現について
https://akinov.hatenablog.com/entry/2017/05/31/194421

■ 郵便番号検索メソッド
API 利用で考える以下日本郵便サイト
http://zipcloud.ibsnet.co.jp/
CORS(クロスドメイン制約)によりオリジンが違うとこからはアクセス不可
JSOP を使う
https://dev.classmethod.jp/articles/about-cors/

■ 住所入力メソッド
住所入力のベストプラクティスを考える
参考 URL
https://www.sukerou.com/2020/03/blog-post_26.html
そして住所入力には EOF(Entry Form Optimization: 入力フォーム最適化)対応をすべき。

方法として
郵便番号から住所検索できる
や
ラベルで表記を綺麗にする
など

■form 内の submit 送信拒否
参考 URL
https://vertys.net/javascript-enter/

==================ここまで==========================

===================必要な技術調査=======================
■ 正規表現
参考
https://javascript.keicode.com/lang/regex-pattern-character-classes.php←これは正確
https://murashun.jp/article/programming/regular-expression.html
コード
return ( str.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/) )? true : false

\u 次の１文字を大文字に変換します。
$ 直前の文字が行の 末尾 にある場合にマッチします。 google$ ...google

■ ユニコードと UTF-8 の違い
https://qiita.com/omiita/items/50814037af2fd8b2b21e
