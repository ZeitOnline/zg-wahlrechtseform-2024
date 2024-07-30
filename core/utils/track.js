export default function (linkId, payload, sendOnUnload = false) {
  // console.log(linkId, payload)
  if (window.wt && window.Zeit) {
    payload['4'] = window.Zeit.breakpoint.getTrackingBreakpoint();

    let params = {
      linkId: `${linkId}`,
      customClickParameter: payload,
    };
    if (sendOnUnload) {
      params.sendOnUnload = 1;
    }
    window.wt.sendinfo(params);
  }
}
