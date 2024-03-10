# AsciiGrid

AsciiGrid is WYSIWYG editor for ASCII/[Svgbob](https://github.com/ivanceras/svgbob) diagrams.

AsciiGrid is available at [mbarkhau.github.io/asciigrid](https://mbarkhau.github.io/asciigrid).

Features:

 - Grid based editing (as opposed to line based)
 - Shareable URLs (that have all diagram data encoded in the URL, so no database backend is required)
 - Copy/Paste, Undo/Redo, Pan/Zoom, etc.
 - Keyboard Shortcuts (Ctrl-A, Home, End, ...)


|               Name                  |    role           |  since  | until |
|-------------------------------------|-------------------|---------|-------|
| Manuel Barkhau (mbarkhau@gmail.com) | author/maintainer | 2019-12 | -     |


Example diagrams (from the [svgbob-editor](https://ivanceras.github.io/svgbob-editor/)):

 - [Basic Shapes](https://mbarkhau.github.io/asciigrid/#vvE;EOAOA;MCACAhAlAtA9ACMBRCAAAgAjApA1AhAMpBaDBRCgFECCCgAEhcjFMinoBAAfCcFm9NAKkQp8DjJDoAgBGlfHhBfCAAcFl_hDKMgCegQn-ECCCgAEgINjFgopAgJmBj7MgJAfh5Fm_AAOOOgAOiHiAmKqHixAAKMNhHfCAeFhCAaDBRgEiOjhchkiMchulHgGjRGCCCCeDgIDAelVFh8i_aDBRhEiInwiMi-AHkQhEAcDCCCChTDADAAeFg_j4WibaDBRg2k9izgZjLhigBOOOgAOjRmdg9ADAAg6agElNaDBgPi6qqhNlCkkfGMsBAARCAWFw7qcuAAAKMPPPPMzHaDBRC-imANMmCfEv1AMCCCgAiAimhQgBcDi0gKeDjMANiBAeFgbgBp_gFGmJhAHiBkNgKhcmCaDjScFhAt5ANCCCCCEAchDNkXKeDhXkGg1DhWgPMPPPPgacFAAWHt8jJDfoCnAxAh5hpyzN-biAOmAgHk-kRgQgCMCMiBkACkDmKhGNANhaAcCNAAKgcaDBRCgOGOHgBhBATDAhDUDAkBGAHUhQgjAViRiGAWidhGXgHgeaDBRChZhAiANCNgDKCkACNjEmKhGMOMhahFOchbo8OOOjDiGmDqAkIpEhARCBRChFcCNgDKMnCkGAMpBmUnHo_gFfhBYDhlFkHZhKiKjKiriKpFlKkHRCBRh5khj1mEiJGijDQDhEHgBiMgPRmJt_AKMOOOcCNmDlFcFlkfikoGlKt8hAh_OOpTAAKMhQMNqCOcClJq6hHmSKMr8rAyARCBRCiFfjBiAcFhCMCCCCCMhEhD-mhFDjJDSjDgDAAcFgCfClCjA8tm0lODiBg4fiX000zknjQk6AANlACCCClF7qAKMOOOgAc6U2uKPPPgAjApA1AuAN)
 - [Quick Logo Scribbles](https://mbarkhau.github.io/asciigrid/#vvE;DOAOA;AAAAAMCCCMiFiAnAAAOBhCfCCfGCgDCkQMgumbDCDsnhbBAMgvAgAg7elagJg3cFlfHi3isgVicfhHcFBGAaCAgog-k2g7AfEAAHivAgDDj5DCeDDhMAGEGCaCCHHBANCMh7nycFgmfCfCjLgbaCiwgoCNCNhGcFcFgIfCBiJFg0l5gKNEgXnGOOnElANCCNi3ANsGgTAAMCCCCMslOiWDiAoMcgoGOHBgeODOOiAlqfCAMCMAcFBhvhZOOCCj4gxGgEHAHBAKCfCMaDaDhAMcFCNk7cFgZNOfCBAgGCCgACmUiOGOH)
 - [Grids](https://mbarkhau.github.io/asciigrid/#vvB;COBOA;AAFCCCCFAAAgAlGBAfCjKcgXhEtAojCEjAiBFBElVgOgTqBFjGDjApA54kFBAck5fCjCtAcFiCDjApAjaimkArAkABAAECCCCElnrAgGkMCjAkFqhrNjABAfCjdcFjCtAfCiCDjApAjalZkArAfCBEkgAECCCCrAgLhIDjApAoaCjApAEBAcFjdfCjCtAcFj8vqkgkArAkABAAGnigAg4pChBDiGjAmDkjCjApAEBl2cFjCfCtAz8hIlVkArAfCBj8gAGCCCCGrAoBCEjAiBgkvDkFBBBBiyHHHlAiDAFjfhAlACFmRsHhPgEjCBAHHHfCgMcFnAi2DhAlAoBAgiggjApAi4hiECCCEhIBiOcFHHHnAiFkehAlAkuxAjnlABw_gHhkADhAlAoBhcgljApAh0ihECCCEhIBgThsHHHnAiFkehAlAkuoPnMkAjCBw_gHi3DhAlAoBAgiggjApAi4hiECCCEhIBhrcFHHHiXnAAAGhghAlAgBGkRtEiQlVG)
 - [Graphics Diagram](https://mbarkhau.github.io/asciigrid/#vvC;BOBOA;AAAQDgCgAATlBkApAQFALBhFLCCCgACLjSEZHxbcFBARDAfCDhKSmBgAybisALCCCgACLAlllAmfWHQhYgtmITDg4DADUiUgGXiEhHUcVCeWVCs2LCCCCcFhCCLi4iNCDCLibZTZCAEiOGAEYHlwfCjCWHAYFgFcFh5lOmAglAUh-lwrwAAKiBi5LCCCgACLkUWHsnpslAg3AVDlqhFgAEamykSHRDALCCCgAjAjALgXSDBBBrhkAMvACMFl0lMKBVEZHVGAfmKAHiBoGlAYChSZCASFVGWGSHRGTGUHZGKeGkscFBgGEghmtcFjVkvcGVrogANCNnmiAhsg3Bm4lRgKWHseiADtBKCCCCCKi_iMiLgALlBqiWH)
 - [Sequence Diagrams](https://mbarkhau.github.io/asciigrid/#vvE;EOBOA;AAAgAjApAkAMCCCeDAAWEBkLREkCShFgATEAAUhRAAfCleag1gACCgGkAiAnIeDAAVElokAAAcFpCeFgOuTAWHnCfCgCNCCCeDAAXv-AASEAhaATEACNBBwPiAcCCM1EKg20EfCDcFjXh-CCMqSDkUDSEfGSGDrtAmyKCECNoRREcGZGTGVGkaAADhBYgPcGcGfGkOnVCCCgAjACCeDoQlBlIoPAZETHAZGUHAfGbGfhopVcDCACAhAjAhXhVcCCECMlfgAREcGZGTGVGkbDSEfGSGDoZhyMkYKCCCNpQKCNkUpKiAfCDcF1FAD3dAg0BpTMQQVCMlpgAGAQDAHpXKCNjJk8hDcFjcnIkNiFWFmnWiQgAMQQVCMmPjJhtAAGARDAHkSGAUgKkuKCNmphIhtAAfCgCcFmRDiJKMBlUlWkWiJhbAWiwgAmAhbibi7MQQVCMjUjGnkkAgDBGASDAHhJGATkDlnmAkCBAKhENi9mDh2Vg3gEWjBXgEBjfjAplmAmA)
 - [Plot Diagrams](https://mbarkhau.github.io/asciigrid/#vvB;AOAOA;AAAgAAASbVCBhFVFZGeGAaQVCgLFCCCgAjApAinhAkiDuAnHhsGUgUhAlAtA9A9AWbVCBBAAAAAVFUGTGSgOBSCjHHPbESCaglidAFCCCgAjAmAj5gAhliEfgEJsIjQpLh4GUgahAlAJtBtA9ApAWbVCBAAAgAjAiAJLCCCCCMJmSSglnWVDQDQDdGTHAnZaQpXjAJBTEQHVHFRFfGeGifUhAlAtA9AgBFCCCgAiABAAAgAAAagWlElADAAZEeGRGTGUHZGWHVGqjhEREnTkvnaCCCgAjAiAGUg0hAlAtApAWbVC)
 - [Railroad Diagrams](https://mbarkhau.github.io/asciigrid/#vvE;GOAOA;AAAgAgAcQVCCCgACQRVCgOMCMlOiOBAAfGCCeWiNDAVGcGVGdGADCCGAbDAHgSeiKdWVggfGgwAAADgBUg_hzCCYgHgOKCNlOjNADlmj4hVeDkBgPiYjclhDhDcQi-Qi-hStYQXVCCfg-CdhBCDAYHADCCehPiYh8iAgjCjvDhAAAURhbCYRVCjOiYhADqbAMCMkDtShaKCCGAcCAHCCNpXeFnahEKrRq5AdWVCCCgAgAeDnBgUrbgAAcQioQRVCgLMCMkVmfQXVhcgDCdg-CDAYHADCCGAcCAHCehQfhBgjhEjwiADAURh5CYRVCgNKCNgSoWKixCCcDjCNoRnAqAMksiAekxmIMBigcQVrKQRVCg5CMh_gDADmcsPk0lNhluKiXBfEOOOODATHUHSHVHTGUHOeGRGdGVGADOGAaDAHgEhCedVChpvOgSUHQHiOOOfijkugYSGfGUGZHiYhcEBAAdgiAAURVCCCgAjACCYRhTKCNAjAAAcgmlgpVgYk3lNdhmgUtOkYcgcBAADieiAnAoAtQiAMCM1DADB-zKCCCgAjAcDjCGAcCAHCCN_28-rAK06hADBhcCCgAjApA1A9AN)
 - [Statistical Charts](https://mbarkhau.github.io/asciigrid/#vvD;DOCOA;AAVEAECCCgAjApACagBEAAAiiDiEiAnAiAfGBAAIAD0rhADhDioglyuhAAgZgEBAAHAgvu3ibgAjAg0gk1vkgBAAGAD4rjAg5gk2tjABAAFAEk-CCEgAjApAi9hjfGChACDgAjApABijAVDAKJAKgELJALgEMJAMgEUDJgBgGVgGjl-LhpBBBBYgJNWDXgXSVCm2mAvAgAdWVCegBBXDYDNLJ1kxoSQVChA65JNXDM1_56n8mAnIoSiFfgBQXgBg2hSBWDMNLXDAUSipgAjApAn5oGl6ASgGhAiRfgBQXjUhRhIhmpMhktQlcAAAhThfBVDVDNYDJAUSiUlwgIgAjAiAlRh2l2iklBnwhbAQXVCQgGfgQpAjZieAnCpIgAhthpBUDYDNMMAUSiXhfhYegZjkdgHQhSgBnMhkhAlApslEfkFjojygAlTpAlABUDJNYDXDAUSVCdgPegBj6hghKmNAhGhyAiXQgipUhEhQhehclAhEisrtljBMMNUDJAUSVCSgRhAAiAmshEegFdgBj-AAiehAldBLVDNZDMq8qlliiImFBKYDNUDXDAcTjMl1BKKNJJAUSg9mlj3URVCQgghAlAtApAUT-C1Y-O1Y-_-K3WBAAAALJKKhEjGKLoBMoBUDoCVpBWD)
 - [Block Diagrams](https://mbarkhau.github.io/asciigrid/#vvB;FOBOA;AWHeGTGWHZGVGXHVGSHAAAgAgAFCcCYCAAZgFCFBAAHHAApThZlGZggnEAXGRGUHVGXHRGZnqAAWHeGTGTgYSHWiBBAbFHHdFDKDAACCCCMYChmZGei_SgvVgHiPhcifAHHHgAhAiwhPiIAAHHBfCWTYhACAfCDHDh4hAGCgPlFAZCFCGlFbFHFFFHhBQLdFkPg3gCADKKDBnvnAGCFYCr7xTgADHHHHDADgHy18gmAfCWTYhAiDgMADHHDBBB2ZORGcGWHVgDVGTHTHACCCgACCFqooAQFVHcGTgxagxUHAVGeGXGZgDVGhdfC1jvAOyWjAHHHgAgAFCCCgAjAjAEmvkAFmSG34AfCAAlgMl7oRFkVFHHHgAgAvycFgCUHYGSHVHTHUHCCMBqVYChAjGHHHgAgAgJQGCCCgAiAfjHCEAAlLs4AcFktCGmLsADskkpCCFHAAHHNHHHFiK3YnQDgbwEisnGWGVHVGcGAAHHNjvANHHTHQHRGSHbgWlyXEeEUEi7mMZGeGUgnbGVilk7gGQHcGVHXn2ADrtoAmssI7T1ZtGHHHHhtQGCCCgAjAFqlqkfCAFgfGsID3YDkWycrHECEChAgBBshFCCCDADgDFgLHH8rDCECEhACDBpMHHHgnjUCDCCfGAAQGCCCgAgAajBgWmKgAPhrhACDBAAFkPMAHHHAADDDgADADAAQHfGXHVGSgUAgAAhRgDakrz6AcFlnitDDDgADh4THXHZGUHTGYGmXjAoogMCECEhACDBiMXFRg0VGSHiKQGmYGpsECCfGCCCiCCEpOmoEBiMZGeGUHRGbGVGkdYEYEPopjADpAj2pTXEVGeGVGSHRGUHfgFsuEiECr7ATFfGcGRgsAQg3h_cGBpWpArAECCCgAiAEqn6aSERGUHUHVGSHZHBkyhAKKKgAKoHhPKKAATgndGSGfGcGZGTGARGeGh-egFRGpmgwq1gOrBDsAnBdGZGTGSHfGAYGVGegIZH2VTGfgtcGAXHfCUHVHegMeGXGAcGVHXGsqhBFCCCCFsKgBYCFCGZCAD4A4AjNQHZGTGfGAWGRGSHRGUGATgIQH0kjFAHHHhNUHSg_dGdh6GcGVGZCvnitjEg1DBgGQFTEgECMAAFCCCCGhBCgDhACGhfSEfGRGSHUGh6QjciAmAhjhZiAXgpfGVHeGUGAQHcg6eGVGAYCWGfGZGcGZC)
 - [Mindmaps](https://mbarkhau.github.io/asciigrid/#vvF;GOBOA;AAAgAjApArAeCCCeDAARENQHMHB-QgAfCwVvAeCCCCCeDAAZEIJGJHNASFFNFHKFBhcQFNHIIJIXGAaimhqCq2fkIgAcjvqSkSzbAAXCCCCeDAQFHGPMARDBZEIJGJHNALFKFHLgSq3uxhWBnDatMzeAAXCCCeDAAQFHGPMASDo6ntoEAAfgwgAhAeDASEFGHppxiAfCqWtUfGgAqFnRFfFhAjAr4m_hAeCCCCeCAaiCjpr8Cmts4AXh4h0DAYhiAAZlllTfEhaAeCASFFNFHKFgJt4nAQGgxXCAfGwKcFfFfhAlA4ug_hAgAcFqZqYChCcFgAlftTeCCCXiiuYw4kGjjXg4CCECeDAAQFVHKMASGHPbGKn3zql6jFFBwbDrDolXCCCCCeDATFFGSGHPbGKm5n3Aszj9BsGWFgotahnXCCCgAeDASFFPFQHGJfGIl3gAUFFHdGAg8Auvg_ofiAWHgnvXofXFfGLbGNHfGOgpAeCvcAXCCCeDeDATEHLFFLAPMHIXGm8lgWFAfClNhAQFUFfEAsHjlpcSEVHXG)
 - [Circuit Diagrams](https://mbarkhau.github.io/asciigrid/#vvD;BOBOA;AAAgAEKJCKVDWFjJiAPPPJcCJUDXDSFBiOaCCCgAhAfGkACDgmDiLkNlXmcCCNg9AEADgDgAgAiFjAjIqOnQDh1CdDdDdDCjNPDPqVANEN-ajNNCgopwDgBLbGL7fhNUDXDJDAEuumEl7AAPDPi6mhVHWEicAOCCNilAOEOkXNENnycFAfCAcEVEIBiMECCCgAgAfGkqADWDhCXDADYhGAKbGAgKn9CECj5krPPPDgBgHNgYCCgCgACNiYqtADqsACQVVhAiDCjpoUhyAAOEO3oAAiytpKl4DfCAAGHqtkAXEeEIvqECCCgAfGCCEgMVDUDXDwslAqwhliCADQGekH2irtiBcCENn_g3rkNCCCgACErsLLJSFDixfGhcDDCEAAZESFWEZDaFMUt6holAo-jAhZhAADECe2hAAdEHMUDJWDMm0QGEOm1DCE3jrHlsmYAAGZFWFLZiSACKLWFWD13w8OCCCCOkNfGCCDcDChEChCCYFAfEVFUFBWDJJJAdGZGTGSHfGAACADAEizDk5jHLpCkNjAiABWERg-RGUGcCAUDJWFAPPPDgBPPt8CCfGt9HDiWiABHRGQgBTGZGUHfGSHAAeHgAjAhCjkl1DAXEeEImHMJVHYEAAHDjYAACCCAUDXDJBpsjWlAmMDMjCKeGWEmNHhoisTCTCTCAAVHWE14pJDCCCgACDDCCNoejAgC1uOiyEiACOsSgAXEeEIlpiI0yiAVDhjUiB0MAD5lgpgCOCCCgAjACfGsA-frTmAPPPgeswQGCCCgAjACakBfCcFhAfqRfGCCDPPPDCOs4rAlALbGrDDkBKbGJB-euANEN3d3dDADAVDbGWDAEAMbGM3r7nZGeGATFVGSHZGVG3t3tOEO3d4dDB-CuAXEeEI)


Software used:

 - [Svgbob](https://github.com/ivanceras/svgbob) to render ASCII -> SVG
 - [Pythonanywhere](https://www.pythonanywhere.com/) for server side rendering.
 - [coreui.io](https://coreui.io/icons/) for icons


# Development

For local development on linux (maybe also macos), setup the virutal environment.

```shell
$ make venv
~/pyenvs/asciigrid/bin/python -m pip install -r requirements.txt
Collecting flask
  Downloading Flask-2.0.1-py3-none-any.whl (94 kB)
....
Installing collected packages: six, MarkupSafe, Werkzeug, pathlib2, Markdown, Jinja2, itsdangerous, click, markdown-svgbob, flask
Successfully installed Jinja2-3.0.1 Markdown-3.3.4 MarkupSafe-2.0.1 Werkzeug-2.0.1 click-8.0.1 flask-2.0.1 itsdangerous-2.0.1 markdown-svgbob-202107.1018 pathlib2-2.3.6 six-1.16.0
 ```

Then you can run a local development server.

```shell
$ make devhttp
ASCIIGRID_DEBUG=1 \
        ~/pyenvs/asciigrid/bin/flask run --port 8000 --reload
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://127.0.0.1:4000/ (Press CTRL+C to quit)
 * Restarting with stat
 ```


# Docker

Port mapping :

- http://localhost:4000 -> asciigrid
- http://localhost:4001 -> bob2svg web service

```shell
$ make docker
docker build -t asciigrid .
Sending build context to Docker daemon  135.4MB
...
docker run -p 4000:80 -p 4001:4001 -it asciigrid
Starting Apache httpd web server: apache2AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.17.0.2. Set the 'ServerName' directive globally to suppress this message
.
[2021-09-10 15:19:25 +0000] [89] [INFO] Starting gunicorn 20.1.0
[2021-09-10 15:19:25 +0000] [89] [INFO] Listening at: http://0.0.0.0:4001 (89)
[2021-09-10 15:19:25 +0000] [89] [INFO] Using worker: sync
[2021-09-10 15:19:25 +0000] [90] [INFO] Booting worker with pid: 90
```
