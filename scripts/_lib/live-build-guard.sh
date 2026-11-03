#!/usr/bin/env bash
# Owner-authorized LIVE checkout and webhook build gate.
# Shared by Cloudflare Pages build and the isolated release-flag tests.
# Do not weaken: orphaned checkouts and retired zero-dollar QA remain blocked.
set -euo pipefail
# Owner-authorized release state may build on main. A webhook must remain
# deployable independently of new checkout so renewals/refunds are processed even
# when the Owner pauses new sales. This is a safety boundary, NOT a prelaunch lock.
if [[ "${CF_PAGES_BRANCH:-main}" == "main" ]]; then
  for forbidden in GU72_ZERO_MONTHLY_FULFILLMENT_ENABLED GU72_ZERO_MONTHLY_QA_ENABLED; do
    if [[ "${!forbidden:-false}" == "true" ]]; then
      echo "SECURITY BUILD BLOCK: retired zero-dollar entitlement QA cannot run in production ($forbidden)." >&2
      exit 9
    fi
  done
  if [[ "${GU58_LIVE_CHECKOUT_ENABLED:-false}" == "true" || "${GU_F600_LIVE_CHECKOUT_ENABLED:-false}" == "true" ]]; then
    if [[ "${GU_PAYMENT_LIVE_LAUNCH_APPROVED:-false}" != "true" ]]; then
      echo 'LIVE BUILD BLOCK: checkout requires explicit global Owner launch approval.' >&2
      exit 9
    fi
  fi
  if [[ "${GU58_LIVE_CHECKOUT_ENABLED:-false}" == "true" ]]; then
    for requirement in GU58_LIVE_DB_CONTRACT_APPROVED GU58_LIVE_FULFILLMENT_APPROVED GU58_LIVE_WEBHOOK_ENABLED; do
      if [[ "${!requirement:-false}" != "true" ]]; then
        echo "LIVE BUILD BLOCK: GU58 checkout requires $requirement." >&2
        exit 9
      fi
    done
  fi
  if [[ "${GU_F600_LIVE_CHECKOUT_ENABLED:-false}" == "true" ]]; then
    for requirement in GU_F600_LIVE_FULFILLMENT_APPROVED GU_F600_LIVE_WEBHOOK_ENABLED; do
      if [[ "${!requirement:-false}" != "true" ]]; then
        echo "LIVE BUILD BLOCK: Founding checkout requires $requirement." >&2
        exit 9
      fi
    done
  fi
fi
