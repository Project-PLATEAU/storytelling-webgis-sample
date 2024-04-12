# ストーリーテリング型 WebGIS 「PLATEAU Past & Future for Action」

![thumbnail](./app/public/img/ogi.png)

## 1.概要
  
本レポジトリでは、3D都市モデルを活用したストーリーテリング型WwbGISコンテンツ「PLATEAU Past & Future for Action」のソースコードを公開しています。  
「PLATEAU Past & Future for Action」は、WebGIS コンテンツにおける表現の新しい可能性を示すことを目的に開発されたサンプルアプリです。WebGISにおける多様なビジュアライゼーション表現を実現するため、本コンテンツは東京都の首都直下地震等の災害リスクを伝えることをテーマに、自動遷移型のストーリーテリングアプリケーションとして構築されています。  
WebGISエンジンとしてはdeck.gl と MapLibre GL JS を組み合わせて使用しました。

### [PLATEAU Past & Future for Action （外部リンク）](https://www.mlit.go.jp/plateau/plateau-pffa/)


![image](https://github.com/Project-PLATEAU/storytelling-webgis-sample/assets/79615787/00867ccc-8479-41b9-b363-6295bdb30e46)


詳細は[技術調査レポート](https://www.mlit.go.jp/plateau/file/libraries/doc/plateau_tech_doc_0058_ver01.pdf)を参照してください。

## 2.利用方法

### Web アプリケーションの起動方法

いくつかのデータはサイズが大きいため GitHub には置いていない。そのため、事前に以下のリンクからそれぞれファイルをダウンロードし、zipファイルを解凍後、ファイル名は変えずに `app/public/data` ディレクトリ配下に配置する必要がある。  
- [MVT 形式の東京 23 区の建築物モデル](https://assets.cms.plateau.reearth.io/assets/7a/97acb8-8f27-413d-bc02-9c343ee57f27/tokyo23-mvt.zip)  
- [MVT 形式の東京 23 区の防火地域又は準防火地域モデル](https://assets.cms.plateau.reearth.io/assets/50/a8418c-54f1-4f2d-973a-a18e5011d149/urbanplan-fireproof-mvt.zip)  
- [震度分布・全壊棟数分布・焼失棟数分布・液状化分布のファイル群](https://assets.cms.plateau.reearth.io/assets/52/6f2145-0ee9-421a-b86b-f14871e1340e/distributions.zip)  
- [避難施設のポイントデータ群](https://assets.cms.plateau.reearth.io/assets/1a/d2ad81-4cd5-4019-8672-066586421ee8/points.zip)  
  
最終的には以下のような構成になる。
```
/app
  /public
    /data
      /tokyo23-mvt
      /urbanplan-fireproof-mvt
      /distributions
      /points
```
  
次に、 Web アプリケーションは以下のように起動する。

1. `yarn install`
2. `yarn dev`

### CityGML を MVT へ変換するスクリプトの起動方法

事前に G空間情報センターから東京都 23 区 3D 都市モデルの 2023 年度の CityGML をダウンロードし、`plateau_citygml_to_mvt/data/plateau_citygml_2023` のように配置する。  
  
次に、 CityGML を MVT へ変換するために以下のスクリプトを実行する。

1. `yarn install`
2. `yarn convert`
3. `tippecanoe -pC -ad -an -aD -pf -pT -Z10 -z16 -e dist -l tokyo23-mvt -ai --hilbert tokyo23.geojsonl`

上記を実行後、 `plateau_citygml_to_mvt/` ディレクトリは以下に `dist/` ディレクトリが生成され、このディレクトリに MVT のファイル群が入っている。  
  
新しく生成した MVT を本アプリケーション上で確認する場合は、生成した `dist/` ディレクトリの名前を `tokyo23-mvt` に変更した上で `app/public/data/` ディレクトリ配下に配置する。

## 3.システム概要

![image](https://github.com/Project-PLATEAU/storytelling-webgis-sample/assets/79615787/99f757dc-c076-49e6-9830-9520adf40c70)

### ストーリーテリング型 WebGIS アプリケーション

ストーリーテリングのコンテンツに応じて、建築物モデルや震度分布・全壊棟数分布・焼失棟数分布・液状化分布といった GIS データを、3D で重畳、アニメーション等を伴いながら表示する。

- 建築物モデル表現
  - メッシュごとにポリゴンの高さを事前に算出し、deck.gl で MVT のポリゴンを押し上げ、高さを表現している。
- 震度分布、全壊棟数分布におけるテライン表現
  - GeoJSON の属性に含まれる値を値が高いほど標高が高くなるように標高画像に変換し、テラインを表現している。
- 全壊棟数におけるパーティクル表現
  - GeoJSON に含まれる各メッシュの中心点の座標にポリゴンを表示する。
  - パーティクルがグラデーションするようにシェーダーで表現を調整している。
- 焼失棟数分布におけるグリッド表現
  - GeoJSON に含まれる各メッシュの中心点の座標にポリゴンを表示する。
- 焼失棟数分布における防火地域又は準防火地域モデルの MVT 表現
  - deck.gl で提供される MVT レイヤーを用いてポリゴンを表示している。
- 液状化分布におけるポリゴン表現
  - 液状化分布の GeoJSON データを deck.gl で提供されるポリゴンレイヤーを使用して表示している。
- 液状化分布における波表現
  - deck.gl-particle というライブラリを使い、液状化分布のメッシュに応じた値をマッピングした画像を読み込ませることで色が指定されているところから一定の距離、パーティクルが流れるという表現を実現できる。
- モデルに応じたライティングの調整

### CityGML を MVT へ変換するスクリプト

Project PLATEAU が提供する 3D 都市モデルの建築物モデルの CityGML を MVT 形式のデータへ変換するためのスクリプト。このスクリプトでは CityGML を GeoJSONL 形式に変換し、 GeoJSONL を tippecanoe を使用して、 MVT へ変換する。

## 4.利用技術

| 技術            | バージョン |
| -------------- | -------- |
| Node.js        | 20.11.1 |
| Yarn           | 1.22.22 |
| deck.gl        | 8.9.30 |
| Maplibre GL JS | 3.3.1 |
| React.js       | 18.2.0 |
| tippeacanoe    | 2.42.0 |

## 5. 動作環境

| 項目             | 最小動作環境   　　　　　　　　　　　　                   | 推奨動作環境            　　　 | 
| --------------- | ---------------------------------------------------- | ------------------------- |
| ブラウザ 　　　　　| JavaScript、React、deck.gl、Maplibre GL JS対応ブラウザ | Google Chrome　120.0以上　|
| CPU             | Intel core i7 以上                                   | Intel core i7 以上                   | 
| メモリ           | 8GB                                                 | 16GB                   | 
| ネットワーク      | インターネット接続                                      | インターネット接続 | 

## 6. 本リポジトリのフォルダ構成

| フォルダ名        | 詳細   |
| ----------------- | ----------------- |
| .github | GitHub Actions用のスクリプト |
| app | ストーリーテリング型WebGISアプリケーションのコード |
| plateau_citygml_to_mvt | CityGML を MVT に変換するためのスクリプト |

## 7.ライセンス
ソースコード及び関連ドキュメントの著作権は国土交通省に帰属します。  
本ドキュメントは[Project PLATEAUのサイトポリシー](https://www.mlit.go.jp/plateau/site-policy/)（CCBY4.0及び政府標準利用規約2.0）に従い提供されています。

## 8.注意事項
本リポジトリは参考資料として提供しているものです。動作保証は行っていません。  
本リポジトリについては予告なく変更又は削除をする可能性があります。  
本リポジトリの利用により生じた損失及び損害等について、国土交通省はいかなる責任も負わないものとします。  

## 9.参考資料
技術検証レポート: https://www.mlit.go.jp/plateau/file/libraries/doc/plateau_tech_doc_0058_ver01.pdf
