gcloud auth login
gcloud app deploy --appyaml=mocd-facedisplay.yaml --project=garden-of-privatised-delights
gcloud app logs tail -s mocd-facedisplay
gcloud app browse -s mocd-facedisplay --project=garden-of-privatised-delights
# https://mocd-facedisplay-dot-garden-of-privatised-delights.ew.r.appspot.com/
