# Google Maps scraper for Ignition leads

Tool: https://github.com/gosom/google-maps-scraper

Maps gives name, phone, website, rating.  
`-email` then opens the listed website and pulls a published address (info@ / hello@). It does not invent Gmail.

## Run on your machine (Docker)

```bash
git clone https://github.com/gosom/google-maps-scraper.git
cd google-maps-scraper
docker pull gosom/google-maps-scraper

docker run --rm \
  -v "$PWD/../ignitiondesk/scraper:/work" \
  gosom/google-maps-scraper \
  -input /work/queries.txt \
  -results /work/leads.csv \
  -email \
  -fast-mode \
  -depth 5 \
  -c 2 \
  -exit-on-inactivity 3m
```

If this repo is already next to the scraper checkout, point `-v` at `scraper/`.

## After the CSV

Keep rows that have an email.  
Do not mail the seven-email sequence until there is an unsubscribe and a physical address in the footer (CAN-SPAM). First pass: inspect `leads.csv`, then a single test to one address you control.
