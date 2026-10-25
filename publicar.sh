#!/usr/bin/env bash
# Publishes the site on GitHub Pages (public repo «apex-agents» of the account git is already logged into). Free, no server.
# Run from Claude Code:  ! bash C:/Users/David/amg-site/publicar.sh
# Own domain later: put the domain in a file named CNAME, push, and point the DNS (see README).
set -e
cd "$(dirname "$0")"
TOK=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | sed -n 's/^password=//p')
[ -n "$TOK" ] || { echo "No GitHub login saved in git."; exit 1; }
API=https://api.github.com; R=apex-agents
H=(-H "Authorization: token $TOK" -H "Accept: application/vnd.github+json")
U=$(curl -s "${H[@]}" $API/user | python -I -c "import json,sys;print(json.load(sys.stdin)['login'])")
echo "Account: $U"
code=$(curl -s -o /dev/null -w "%{http_code}" "${H[@]}" $API/repos/$U/$R)
[ "$code" = "200" ] || curl -s -o /dev/null -w "Repo created: %{http_code}\n" -X POST "${H[@]}" $API/user/repos \
  -d "{\"name\":\"$R\",\"description\":\"Apex Agents — web studio site\",\"private\":false,\"has_wiki\":false,\"has_projects\":false}"
git add -A && git commit -q -m "Site update $(date +%F)" || true
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$U/$R.git"
git push -u origin main
curl -s -o /dev/null -w "GitHub Pages: %{http_code}\n" -X POST "${H[@]}" $API/repos/$U/$R/pages -d '{"source":{"branch":"main","path":"/"}}' || true
echo "Done. In 1-2 minutes: https://$(echo "$U" | tr A-Z a-z).github.io/$R/"
