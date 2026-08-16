(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){let n=null;for(let r of e){let e=Number(r);!Number.isInteger(e)||e>t||(n===null||e>n)&&(n=e)}return n}function t(t,n){let r=e(Object.keys(t.livingEstimates),n);return r===null?{value:null,carriedForward:!1}:{value:t.livingEstimates[String(r)]??null,carriedForward:r!==n}}function n(t,n,r){let i=e(Object.keys(t.potContributions).filter(e=>t.potContributions[e]?.[r]!==void 0),n);return i===null?{value:0,carriedForward:!1}:{value:t.potContributions[String(i)]?.[r]??0,carriedForward:i!==n}}function r(t,n,r){return e(Object.keys(t.potContributions).filter(e=>Number(e)<n&&t.potContributions[e]?.[r]!==void 0),n)!==null}function i(e){if(e===`external`)return{kind:`external`};let[t,n]=e.split(`:`);if(t===`window`&&n!==void 0){let e=Number(n);return Number.isInteger(e)?{kind:`window`,index:e}:null}return t===`pot`&&n!==void 0&&n!==``?{kind:`pot`,potId:n}:null}function a(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function o(e){let t=e.lastIndexOf(`::`);return t===-1?null:{generatorId:e.slice(0,t),date:e.slice(t+2)}}function s(e,t){let n={...e,...t};for(let[e,r]of Object.entries(t))r===void 0&&delete n[e];return n}function c(e,t,n){return e.find(e=>e.date===t)===void 0?[...e,s({date:t},n)]:e.map(e=>e.date===t?s(e,n):e)}function l(e,t,n){switch(e.kind){case`recurring`:return{...e,overrides:c(e.overrides??[],t,n)};case`irregular`:return{...e,dates:e.dates.map(e=>e.date===t?s(e,n):e)};case`one-off`:return s(e,n)}}function u(e,t,n){let r=o(t);return r===null||!e.generators.some(e=>e.id===r.generatorId)?e:{...e,generators:e.generators.map(e=>e.id===r.generatorId?l(e,r.date,n):e)}}function d(e,t,n){let r=i(n);return r===null?e:u(e,t,{fundedFrom:r})}function f(e,t,n){let r=n.trim();if(r===``)return u(e,t,{amount:void 0});let i=Number(r);return!Number.isFinite(i)||i<0?e:u(e,t,{amount:i})}function p(e,t,n,r){return u(e,t,{paid:n,paidOn:n?r:void 0})}function m(e,t,n){let r=String(t),i={...e.livingEstimates},o=a(n);return o===null?delete i[r]:i[r]=o,{...e,livingEstimates:i}}function h(e,t,n,i){let o=String(t),s=a(i),c={...e.potContributions[o]??{}},l=s===0&&r(e,t,n);s===null||s===0&&!l?delete c[n]:c[n]=s;let u={...e.potContributions};return Object.keys(c).length===0?delete u[o]:u[o]=c,{...e,potContributions:u}}function g(e){return String(e).padStart(2,`0`)}function _(e){return`${e.getUTCFullYear()}-${g(e.getUTCMonth()+1)}-${g(e.getUTCDate())}`}function ee(e=new Date){return`${e.getFullYear()}-${g(e.getMonth()+1)}-${g(e.getDate())}`}function v(e){let[t,n,r]=e.split(`-`).map(Number);if(t===void 0||n===void 0||r===void 0)throw Error(`Invalid ISO date: "${e}"`);return new Date(Date.UTC(t,n-1,r))}function y(e,t){let n=v(e);return n.setUTCDate(n.getUTCDate()+t),_(n)}function b(e,t,n){return e>=t&&e<=n}var te=864e5;function ne(e,t){return Math.round((v(t).getTime()-v(e).getTime())/te)}function re(e,t){let n=v(e),r=n.getUTCDate(),i=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth()+t,1)),a=new Date(Date.UTC(i.getUTCFullYear(),i.getUTCMonth()+1,0)).getUTCDate();return i.setUTCDate(Math.min(r,a)),_(i)}function ie(e,t,n,r,i){return e.filter(e=>e.entryType===t&&n.includes(e.status)&&b(e.date,r,i)).reduce((e,t)=>e+t.amount,0)}function ae(e,t,n,r){return e.filter(e=>e.entryType===`income`&&t.includes(e.status)&&e.date>n&&e.date<=r).reduce((e,t)=>e+t.amount,0)}function oe(e){return e.paidOn??e.date}function se(e,t,n,r){return e.filter(e=>e.entryType===`expense`&&t.includes(e.status)&&oe(e)>r&&n(e)).reduce((e,t)=>e+t.amount,0)}function ce(e,t,n){return ie(e,`income`,[`confirmed`,`expected`],t,n)-ie(e,`expense`,[`confirmed`,`expected`],t,n)}function le(e,t,n,r,i){let a=ae(t,[`received`,`confirmed`],e.asOfDateTime,n),o=se(t,[`received`,`confirmed`],i,e.asOfDateTime);return e.amount+a-o-r}function ue(e,t,n,r,i){let a=le(e,t,n,r,i),o=ae(t,[`expected`],e.asOfDateTime,n),s=se(t,[`expected`],i,e.asOfDateTime);return a+o-s}function de(e,t){return ne(e.asOfDateTime.slice(0,10),t)}function fe(e){let{balance:t,entries:n,cycleStart:r,horizon:i,safetyBuffer:a,today:o,isOutstandingHere:s,potContributions:c}=e,l=n.filter(e=>e.status===`expected`&&b(e.date,o,i)).length,u=e=>e-c;return{plan:ce(n,r,i)-c,conservative:t===null?null:u(le(t,n,i,a,s)),expected:t===null?null:u(ue(t,n,i,a,s)),hasBalance:t!==null,balanceAgeDays:t===null?null:de(t,o),unconfirmedCount:l,nextAnchorDate:i,safetyBuffer:a,potsIncluded:!1,potContributions:c}}var pe={weekly:7,fortnightly:14,"four-weekly":28};function x(e,t,n){return t===`monthly`?re(e,n):y(e,pe[t]*n)}function me(e,t,n,r){let i=[];for(let a=0;a<r;a+=1){let r=n+a,o=x(e,t,r),s=x(e,t,r+1);i.push({index:r,start:o,end:y(s,-1)})}return i}function S(e,t,n){if(n!==`monthly`)return Math.floor(ne(t,e)/pe[n]);let r=v(t),i=v(e),a=(i.getUTCFullYear()-r.getUTCFullYear())*12+(i.getUTCMonth()-r.getUTCMonth());for(;e<x(t,n,a);)--a;for(;e>=x(t,n,a+1);)a+=1;return a}function he(e,t,n){return e.fundedFrom??{kind:`window`,index:S(e.date,t,n)}}function ge(e,t){return e.kind===`window`&&e.index===t}function _e(e,t,n){return e.kind===`external`?`Paid elsewhere`:e.kind===`pot`?t.find(t=>t.id===e.potId)?.name??`Deleted pot`:e.index<n?`Prepaid`:e.index>n?`Paying ahead`:null}var ve=[[`day`,`day`,`days`],[`week`,`week`,`weeks`],[`month`,`month`,`months`],[`quarter`,`quarter`,`quarters`],[`year`,`year`,`years`]],ye={month:1,quarter:3,year:12},be={day:1,week:7};function xe(e,t,n){let r=ye[t.unit];return r===void 0?y(e,(be[t.unit]??1)*t.every*n):re(e,t.every*r*n)}function Se(e){return ve.some(([t])=>t===e)}function Ce(e){if(typeof e!=`object`||!e)return!1;let t=e.every;return typeof t==`number`&&Number.isInteger(t)&&t>=1&&Se(e.unit)}function we(e){switch(e){case`weekly`:return{every:1,unit:`week`};case`fortnightly`:return{every:2,unit:`week`};case`four-weekly`:return{every:4,unit:`week`};case`monthly`:return{every:1,unit:`month`}}}var Te=90,Ee=2e3;function De(e,t){return(e.amountChanges??[]).filter(e=>e.effectiveFrom<=t).sort((e,t)=>e.effectiveFrom.localeCompare(t.effectiveFrom)).at(-1)?.amount??e.amount}function Oe(e,t,n){let r=[];for(let i=0;i<Ee;i+=1){let a=xe(e.startDate,e.recurrence,i);if(e.endDate!==void 0&&a>e.endDate||a>n)break;a>=t&&r.push(a)}return r}function ke(e,t,n){let r=Oe(e,y(t,-90),y(n,Te)),i=[];for(let a of r){let r=e.overrides?.find(e=>e.date===a);if(r?.skipped===!0)continue;let o=r?.movedTo??a;b(o,t,n)&&i.push({id:`${e.id}::${a}`,date:o,amount:r?.amount??De(e,a),entryType:e.entryType,status:r?.status??e.status,generatorId:e.id,label:e.label,amountKind:e.amountKind,isEstimate:e.amountKind===`variable`&&r?.amount===void 0,fundedFrom:r?.fundedFrom??null,paidOverride:r?.paid??null,paidOn:r?.paidOn??null})}return i.sort((e,t)=>e.date.localeCompare(t.date))}function Ae(e,t,n){switch(e.kind){case`recurring`:return ke(e,t,n);case`irregular`:return e.dates.filter(e=>b(e.date,t,n)).map(t=>({id:`${e.id}::${t.date}`,date:t.date,amount:t.amount,entryType:e.entryType,status:t.status,generatorId:e.id,label:e.label,amountKind:e.amountKind,isEstimate:e.amountKind===`variable`,fundedFrom:t.fundedFrom??null,paidOverride:t.paid??null,paidOn:t.paidOn??null}));case`one-off`:return b(e.date,t,n)?[{id:`${e.id}::${e.date}`,date:e.date,amount:e.amount,entryType:e.entryType,status:e.status,generatorId:e.id,label:e.label,amountKind:e.amountKind,isEstimate:e.amountKind===`variable`,fundedFrom:e.fundedFrom??null,paidOverride:e.paid??null,paidOn:e.paidOn??null}]:[]}}var je=1e3;function Me(e,t,n){let r=0;for(;r<je&&!(x(e,n,r+1)>t);)r+=1;return r}function Ne(e,t,n){let r=e.balance?.amount??0,i=e.targetAmount;if(i===null)return{balance:r,target:null,remaining:null,cyclesRemaining:null,requiredPerCycle:null,isFunded:!1,isOverdue:!1};let a=Math.max(0,i-r),o=a===0,s=e.targetDate!==null&&e.targetDate<t&&!o,c=e.targetDate===null?null:Me(t,e.targetDate,n),l=null;return e.mode===`active`&&(l=o?0:c===null?null:c===0?a:a/c),{balance:r,target:i,remaining:a,cyclesRemaining:c,requiredPerCycle:l,isFunded:o,isOverdue:s}}function Pe(e,t){return e.paidOverride===null?e.status===`received`||e.amountKind===`fixed`&&e.date<t:e.paidOverride}function Fe(e,t){return Pe(e,t)?e.entryType===`income`?`Received`:`Paid`:e.status===`expected`?`Expected`:`Upcoming`}var Ie=400;function Le(e,t){return e.filter(e=>t.includes(e.status)).reduce((e,t)=>e+t.amount,0)}function Re(e){return e.reduce((e,t)=>e+t.amount,0)}function ze(e){let t=new Map;for(let n of e){let e=t.get(n.generatorId);(e===void 0||n.date<e.date)&&t.set(n.generatorId,n)}return[...t.values()].sort((e,t)=>e.date.localeCompare(t.date))}function Be(e,r,i){let a=S(r,e.anchorDate,e.anchorCadence),o=me(e.anchorDate,e.anchorCadence,a,i),s=o[0]?.start??r,c=o.at(-1)?.end??r,l=y(c,Ie),u=e.pots.map(e=>({id:e.id,name:e.name})),d=e.generators.flatMap(e=>Ae(e,s,l)).map(t=>{let n=he(t,e.anchorDate,e.anchorCadence),i=S(t.date,e.anchorDate,e.anchorCadence);return{...t,funding:n,dueWindowIndex:i,isSettled:Pe(t,r),statusLabel:Fe(t,r),fundingNote:t.entryType===`expense`?_e(n,u,i):null}}),f=o.map(i=>{let a=d.filter(e=>b(e.date,i.start,i.end)),o=a.filter(e=>e.entryType===`income`),s=a.filter(e=>e.entryType===`expense`),c=d.filter(e=>e.entryType===`expense`&&ge(e.funding,i.index)),l=Le(o,[`received`,`confirmed`]),u=Le(o,[`expected`]),f=Re(c.filter(e=>e.amountKind===`fixed`)),p=Re(c.filter(e=>e.amountKind===`variable`)),m=f+p,h=e.pots.map(t=>{let r=n(e,i.index,t.id);return{potId:t.id,name:t.name,amount:r.value,carriedForward:r.carriedForward}}),g=h.reduce((e,t)=>e+t.amount,0),_=l+u-m-g,ee=t(e,i.index),v=ee.value;return{...i,isCurrent:b(r,i.start,i.end),income:o,expenses:s,confirmedIncome:l,expectedIncome:u,fixedExpenses:f,variableExpenses:p,chargedExpenses:m,contributions:h,totalContributions:g,planSurplus:_,livingEstimate:v,livingEstimateCarriedForward:ee.carriedForward,leftAfterLiving:v===null?null:_-v}}),p=f[0]?.end??r,m=f[0]?.index??a;return{windows:f,summary:fe({balance:e.mainBalance,entries:d,cycleStart:f[0]?.start??r,horizon:p,safetyBuffer:e.safetyBuffer,today:r,isOutstandingHere:t=>ge(he(t,e.anchorDate,e.anchorCadence),m),potContributions:f[0]?.totalContributions??0}),pots:e.pots.map(t=>({...t,progress:Ne(t,r,e.anchorCadence)})),upcomingBeyond:ze(d.filter(e=>e.date>c))}}function C(e){return`${e}-${typeof crypto<`u`&&`randomUUID`in crypto?crypto.randomUUID().slice(0,8):Math.random().toString(36).slice(2,10)}`}function Ve(e,t){return{...e,generators:[...e.generators,t]}}function He(e,t){return e.generators.some(e=>e.id===t.id)?{...e,generators:e.generators.map(e=>e.id===t.id?t:e)}:e}function Ue(e,t){return e.generators.some(e=>e.id===t)?{...e,generators:e.generators.filter(e=>e.id!==t)}:e}function We(e,t){return{...e,pots:[...e.pots,t]}}function Ge(e,t){return e.pots.some(e=>e.id===t.id)?{...e,pots:e.pots.map(e=>e.id===t.id?t:e)}:e}function Ke(e,t){let n=e=>{if(e.fundedFrom?.kind!==`pot`||e.fundedFrom.potId!==t)return e;let{fundedFrom:n,...r}=e;return r};switch(e.kind){case`recurring`:return e.overrides===void 0?e:{...e,overrides:e.overrides.map(n)};case`irregular`:return{...e,dates:e.dates.map(n)};case`one-off`:return n(e)}}function qe(e,t){if(!e.pots.some(e=>e.id===t))return e;let n={};for(let[r,i]of Object.entries(e.potContributions)){let{[t]:e,...a}=i;Object.keys(a).length>0&&(n[r]=a)}return{...e,pots:e.pots.filter(e=>e.id!==t),potContributions:n,generators:e.generators.map(e=>Ke(e,t))}}function Je(e,t){let n=0;for(let r of e.generators)switch(r.kind){case`recurring`:n+=(r.overrides??[]).filter(e=>e.fundedFrom?.kind===`pot`&&e.fundedFrom.potId===t).length;break;case`irregular`:n+=r.dates.filter(e=>e.fundedFrom?.kind===`pot`&&e.fundedFrom.potId===t).length;break;case`one-off`:r.fundedFrom?.kind===`pot`&&r.fundedFrom.potId===t&&(n+=1)}let r=Object.values(e.potContributions).filter(e=>e[t]!==void 0).length;return{fundedEntries:n,contributedCycles:r}}var w=/^\d{4}-\d{2}-\d{2}$/;function Ye(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function Xe(e){return{id:``,label:``,entryType:`expense`,amountKind:`fixed`,kind:`recurring`,status:`confirmed`,amount:``,every:`1`,unit:`month`,startDate:e,endDate:``,date:e,instalments:[{date:e,amount:``}]}}function Ze(e,t){let n={...Xe(t),id:e.id,label:e.label,entryType:e.entryType,amountKind:e.amountKind,kind:e.kind};switch(e.kind){case`recurring`:return{...n,status:e.status,amount:String(e.amount),every:String(e.recurrence.every),unit:e.recurrence.unit,startDate:e.startDate,endDate:e.endDate??``};case`one-off`:return{...n,status:e.status,amount:String(e.amount),date:e.date};case`irregular`:return{...n,instalments:e.dates.map(e=>({date:e.date,amount:String(e.amount)}))}}}function Qe(e){let t=e.label.trim();if(t===``)return{ok:!1,error:`Give it a name so you can recognise it.`};let n={id:e.id,label:t,entryType:e.entryType,amountKind:e.amountKind};if(e.kind===`irregular`){let t=e.instalments.filter(e=>e.date.trim()!==``||e.amount.trim()!==``);if(t.length===0)return{ok:!1,error:`Add at least one instalment, with a date and an amount.`};let r=[];for(let n of t){let t=Ye(n.amount);if(!w.test(n.date))return{ok:!1,error:`Every instalment needs a date.`};if(t===null)return{ok:!1,error:`Every instalment needs an amount of zero or more.`};r.push({date:n.date,amount:t,status:e.status})}return{ok:!0,generator:{...n,kind:`irregular`,dates:r.sort((e,t)=>e.date.localeCompare(t.date))}}}let r=Ye(e.amount);if(r===null)return{ok:!1,error:e.amountKind===`variable`?`Give a typical amount to estimate with — you can correct it each time.`:`Enter an amount of zero or more.`};if(e.kind===`one-off`)return w.test(e.date)?{ok:!0,generator:{...n,kind:`one-off`,date:e.date,amount:r,status:e.status}}:{ok:!1,error:`Pick a date.`};let i=Number(e.every.trim());if(!Number.isInteger(i)||i<1)return{ok:!1,error:`How often it repeats has to be a whole number, 1 or more.`};if(!Se(e.unit))return{ok:!1,error:`Pick days, weeks, months, quarters or years.`};if(!w.test(e.startDate))return{ok:!1,error:`Pick the date this starts from.`};let a=e.endDate.trim();return a!==``&&!w.test(a)?{ok:!1,error:`That end date isn't a real date.`}:a!==``&&a<e.startDate?{ok:!1,error:`It can't end before it starts.`}:{ok:!0,generator:{...n,kind:`recurring`,recurrence:{every:i,unit:e.unit},amount:r,startDate:e.startDate,status:e.status,...a===``?{}:{endDate:a}}}}var $e=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`],et=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`];function T(e){return`${e<0?`-`:``}$${Math.abs(e).toLocaleString(`en-AU`,{minimumFractionDigits:2,maximumFractionDigits:2})}`}function E(e){let[t,n,r]=e.split(`-`).map(Number);return t===void 0||n===void 0||r===void 0?e:`${r} ${$e[n-1]}`}function D(e){let[t,n,r]=e.split(`-`).map(Number);return t===void 0||n===void 0||r===void 0?e:`${et[new Date(Date.UTC(t,n-1,r)).getUTCDay()]} ${r} ${$e[n-1]}`}function tt(e){return e===0?`today`:e===1?`1 day ago`:`${e} days ago`}function O(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}var nt=[[`recurring`,`Repeats`,`Weekly, monthly, quarterly, yearly — whatever it is`],[`one-off`,`Just once`,`A single dated payment`],[`irregular`,`Split into instalments`,`One cost spread over several dates`]];function k(e,t,n){return`<div class="radio-row">
    ${n.map(([n,r,i])=>`
        <label class="radio-card${t===n?` selected`:``}">
          <input type="radio" name="${e}" value="${n}"${t===n?` checked`:``}>
          <span class="radio-label">${r}</span>
          ${i===void 0?``:`<span class="radio-hint">${i}</span>`}
        </label>`).join(``)}
  </div>`}function rt(e,t){let n=e.amountKind===`variable`;return`
    <dialog id="generatorDialog" class="dialog dialog-wide">
      <div class="dialog-body">
        <h2>${t?`Add income or a bill`:`Edit ${O(e.label||`entry`)}`}</h2>
        ${t?`<p class="field-note">Usually just the bills you are committed to. Groceries,
                 fuel and the like are easier as one figure in the living-expenses estimate at
                 the foot of each cycle — though you can enter them here if you would rather.</p>`:``}

        <label class="field">
          <span>What is it</span>
          <input type="text" id="genLabel" value="${O(e.label)}"
            placeholder="Rent, Salary, Power…" maxlength="60" autocomplete="off">
        </label>

        <div class="field">
          <span>Money in or out</span>
          ${k(`genType`,e.entryType,[[`income`,`Money in`],[`expense`,`Money out`]])}
        </div>

        <div class="field">
          <span>Is the amount the same every time</span>
          ${k(`genAmountKind`,e.amountKind,[[`fixed`,`Always the same`,`Rent, a subscription`],[`variable`,`Changes each time`,`Power, a credit card`]])}
        </div>

        <div class="field">
          <span>When</span>
          ${k(`genKind`,e.kind,nt)}
        </div>

        ${e.kind===`irregular`?`
          <div class="field">
            <span>Instalments</span>
            <div class="instalments">
              ${e.instalments.map((t,n)=>`
                <div class="instalment-row">
                  <input type="date" data-inst-date="${n}" value="${t.date}">
                  <span class="balance-input-wrap">
                    <span class="currency">$</span>
                    <input type="number" step="0.01" min="0" data-inst-amount="${n}"
                      value="${O(t.amount)}" placeholder="0.00">
                  </span>
                  <button type="button" class="ghost-btn tiny" data-inst-remove="${n}"
                    ${e.instalments.length===1?`disabled`:``}
                    aria-label="Remove instalment">Remove</button>
                </div>`).join(``)}
            </div>
            <button type="button" class="ghost-btn" id="addInstalment">Add instalment</button>
          </div>`:`
          <label class="field">
            <span>${n?`Typical amount`:`Amount`}</span>
            <span class="balance-input-wrap">
              <span class="currency">$</span>
              <input type="number" id="genAmount" step="0.01" min="0"
                value="${O(e.amount)}" placeholder="0.00">
            </span>
            ${n?`<small>Used as the estimate until you enter the real figure each time.</small>`:``}
          </label>`}

        ${e.kind===`recurring`?`
          <div class="field">
            <span>How often</span>
            <div class="every-row">
              <span class="every-prefix">Every</span>
              <input
                type="number" inputmode="numeric" min="1" step="1"
                id="genEvery" class="every-count"
                value="${O(e.every)}"
                aria-label="How many">
              <select id="genUnit" class="every-unit" aria-label="Days, weeks, months, quarters or years">
                ${ve.map(([t,n,r])=>`<option value="${t}"${e.unit===t?` selected`:``}>${e.every.trim()===`1`?n:r}</option>`).join(``)}
              </select>
            </div>
          </div>
          <div class="field-pair">
            <label class="field">
              <span>First one on</span>
              <input type="date" id="genStart" value="${e.startDate}">
            </label>
            <label class="field">
              <span>Stops after (optional)</span>
              <input type="date" id="genEnd" value="${O(e.endDate)}">
            </label>
          </div>`:``}

        ${e.kind===`one-off`?`
          <label class="field">
            <span>Date</span>
            <input type="date" id="genDate" value="${e.date}">
          </label>`:``}

        <div class="field">
          <span>How sure are you</span>
          ${k(`genStatus`,e.status,[[`confirmed`,`Confirmed`,`It is definitely happening`],[`expected`,`Expected`,`Likely, but not locked in`]])}
        </div>

        <p class="dialog-error" id="genError" hidden></p>

        <div class="dialog-actions">
          ${t?``:`<button type="button" class="danger-btn" id="genDelete">Delete</button>`}
          <span class="spacer"></span>
          <button type="button" class="ghost-btn" id="genCancel">Cancel</button>
          <button type="button" class="primary-btn" id="genSave">
            ${t?`Add`:`Save`}
          </button>
        </div>
      </div>
    </dialog>`}function A(e,t){let n=t=>e.querySelector(t),r=(t,n)=>e.querySelector(`input[name="${t}"]:checked`)?.value??n,i=[...e.querySelectorAll(`.instalment-row`)].map(e=>({date:e.querySelector(`[data-inst-date]`)?.value??``,amount:e.querySelector(`[data-inst-amount]`)?.value??``}));return{...t,label:n(`#genLabel`)?.value??t.label,entryType:r(`genType`,t.entryType),amountKind:r(`genAmountKind`,t.amountKind),kind:r(`genKind`,t.kind),status:r(`genStatus`,t.status),amount:n(`#genAmount`)?.value??t.amount,every:n(`#genEvery`)?.value??t.every,unit:n(`#genUnit`)?.value??t.unit,startDate:n(`#genStart`)?.value??t.startDate,endDate:n(`#genEnd`)?.value??t.endDate,date:n(`#genDate`)?.value??t.date,instalments:i.length>0?i:t.instalments}}var it=/^\d{4}-\d{2}-\d{2}$/;function at(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function ot(e){return{id:``,name:``,balance:``,balanceAsOf:e,targetAmount:``,targetDate:``,mode:`passive`}}function st(e,t){return{id:e.id,name:e.name,balance:e.balance===null?``:String(e.balance.amount),balanceAsOf:e.balance?.asOfDateTime.slice(0,10)??t,targetAmount:e.targetAmount===null?``:String(e.targetAmount),targetDate:e.targetDate??``,mode:e.mode}}function ct(e,t){let n=e.name.trim();if(n===``)return{ok:!1,error:`Give the pot a name.`};let r=at(e.balance);if(e.balance.trim()!==``&&r===null)return{ok:!1,error:`That balance isn't a number of zero or more.`};let i=e.balanceAsOf.trim();if(r!==null&&!it.test(i))return{ok:!1,error:`Pick the date this pot balance was read.`};let a=i>t?t:i,o=at(e.targetAmount);if(e.targetAmount.trim()!==``&&o===null)return{ok:!1,error:`That target isn't a number of zero or more.`};let s=e.targetDate.trim();return s!==``&&!it.test(s)?{ok:!1,error:`That target date isn't a real date.`}:e.mode===`active`&&(o===null||s===``)?{ok:!1,error:`To work out how much to put away each pay, this needs both a target amount and a date to reach it by.`}:{ok:!0,pot:{id:e.id,name:n,balance:r===null?null:{amount:r,asOfDateTime:a},targetAmount:o,targetDate:s===``?null:s,mode:e.mode}}}function lt(e){let t=[];return e.fundedEntries>0&&t.push(`${e.fundedEntries} ${e.fundedEntries===1?`bill is`:`bills are`} paid from it`),e.contributedCycles>0&&t.push(`${e.contributedCycles} pay ${e.contributedCycles===1?`cycle puts`:`cycles put`} money in`),t.length===0?``:`<p class="dialog-note">Deleting this pot: ${t.join(`, `)}. Those bills go back to
    being paid from the cycle they fall in.</p>`}function ut(e,t,n){let r=e.mode===`active`;return`
    <dialog id="potDialog" class="dialog">
      <div class="dialog-body">
        <h2>${t?`Add a savings pot`:`Edit ${O(e.name||`pot`)}`}</h2>

        <label class="field">
          <span>What is it for</span>
          <input type="text" id="potName" value="${O(e.name)}"
            placeholder="Car rego, Christmas, Future bills…" maxlength="60" autocomplete="off">
        </label>

        <div class="field-pair">
          <label class="field">
            <span>How much is in it</span>
            <span class="balance-input-wrap">
              <span class="currency">$</span>
              <input type="number" id="potBalance" step="0.01" min="0"
                value="${O(e.balance)}" placeholder="0.00">
            </span>
          </label>
          <label class="field">
            <span>As of</span>
            <input type="date" id="potBalanceAsOf" value="${e.balanceAsOf}">
          </label>
        </div>
        <small class="field-note">This money sits in its own account, so it is never counted
          as safe to spend.</small>

        <div class="field">
          <span>Are you saving toward something</span>
          <div class="radio-row">
            <label class="radio-card${r?``:` selected`}">
              <input type="radio" name="potMode" value="passive"${r?``:` checked`}>
              <span class="radio-label">Just setting money aside</span>
              <span class="radio-hint">Track what is in it, no target</span>
            </label>
            <label class="radio-card${r?` selected`:``}">
              <input type="radio" name="potMode" value="active"${r?` checked`:``}>
              <span class="radio-label">Working toward an amount</span>
              <span class="radio-hint">Fortify works out how much per pay</span>
            </label>
          </div>
        </div>

        <div class="field-pair">
          <label class="field">
            <span>Target${r?``:` (optional)`}</span>
            <span class="balance-input-wrap">
              <span class="currency">$</span>
              <input type="number" id="potTarget" step="0.01" min="0"
                value="${O(e.targetAmount)}" placeholder="0.00">
            </span>
          </label>
          <label class="field">
            <span>Needed by${r?``:` (optional)`}</span>
            <input type="date" id="potTargetDate" value="${O(e.targetDate)}">
          </label>
        </div>

        ${t?``:lt(n)}
        <p class="dialog-error" id="potError" hidden></p>

        <div class="dialog-actions">
          ${t?``:`<button type="button" class="danger-btn" id="potDelete">Delete</button>`}
          <span class="spacer"></span>
          <button type="button" class="ghost-btn" id="potCancel">Cancel</button>
          <button type="button" class="primary-btn" id="potSave">${t?`Add`:`Save`}</button>
        </div>
      </div>
    </dialog>`}function dt(e,t){let n=t=>e.querySelector(`#${t}`)?.value;return{...t,name:n(`potName`)??t.name,balance:n(`potBalance`)??t.balance,balanceAsOf:n(`potBalanceAsOf`)??t.balanceAsOf,targetAmount:n(`potTarget`)??t.targetAmount,targetDate:n(`potTargetDate`)??t.targetDate,mode:e.querySelector(`input[name="potMode"]:checked`)?.value??t.mode}}var ft=/^\d{4}-\d{2}-\d{2}$/;function j(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function pt(e){return{step:1,name:`My budget`,cadence:`fortnightly`,anchorDate:e,incomeLabel:``,incomeAmount:``,balance:``}}function mt(e,t){return t===1?e.name.trim()===``?`Give this budget a name.`:ft.test(e.anchorDate)?null:`Pick a recent payday.`:t===2?e.incomeLabel.trim()===``?`What is this income called?`:j(e.incomeAmount)===null?`How much lands each time? Enter zero or more.`:null:e.balance.trim()!==``&&j(e.balance)===null?`That balance isn't a number of zero or more.`:null}function ht(e,t=4){return ft.test(e.anchorDate)?me(e.anchorDate,e.cadence,0,t):[]}function gt(e){return we(e)}function _t(e,t){let n={id:C(`gen`),kind:`recurring`,label:e.incomeLabel.trim(),entryType:`income`,amountKind:`fixed`,recurrence:gt(e.cadence),amount:j(e.incomeAmount)??0,startDate:e.anchorDate,status:`confirmed`},r=j(e.balance);return{id:C(`budget`),name:e.name.trim(),anchorDate:e.anchorDate,anchorCadence:e.cadence,safetyBuffer:0,livingEstimates:{},potContributions:{},mainBalance:r===null?null:{amount:r,asOfDateTime:t},pots:[],generators:[n]}}var vt=[[`weekly`,`Weekly`],[`fortnightly`,`Fortnightly`],[`four-weekly`,`Every 4 weeks`],[`monthly`,`Monthly`]],yt=[``,`When do you get paid?`,`What is your main income?`,`What is in your account right now?`],bt=[``,`Fortify organises everything around your pay cycle rather than the calendar month, so the question it answers is always the same one: where does my money need to go?`,`The regular one that everything else is planned around. You can add side income, rent and one-off payments once you are set up.`,`This is what turns a forecast into a figure you can actually spend against. You can skip it and add it later.`];function xt(e,t){let n=ht(e);if(n.length===0)return``;if(t===1)return`
      <div class="wiz-preview">
        <p class="wiz-preview-label">Your cycles would be</p>
        <ul class="wiz-cycles">
          ${n.map((e,t)=>`
            <li class="${t===0?`is-current`:``}">
              <strong>${D(e.start)}</strong>
              <span>to ${E(e.end)}</span>
            </li>`).join(``)}
        </ul>
      </div>`;let r=Number(e.incomeAmount),i=Number.isFinite(r)&&e.incomeAmount.trim()!==``,a=e.incomeLabel.trim()||`Your income`;if(t===2)return`
      <div class="wiz-preview">
        <p class="wiz-preview-label">Your first cycle would start</p>
        <ul class="wiz-cycles">
          <li class="is-current">
            <strong>${D(n[0]?.start??e.anchorDate)}</strong>
            <span>${O(a)} ${i?`+${T(r)}`:``}</span>
          </li>
        </ul>
        <p class="wiz-preview-note">Repeating every cycle from then on.</p>
      </div>`;let o=Number(e.balance),s=Number.isFinite(o)&&e.balance.trim()!==``;return`
    <div class="wiz-preview">
      <p class="wiz-preview-label">${s?`Safe to spend would start from`:`Without a balance you would see`}</p>
      <p class="wiz-figure">${s?T(o):i?T(r):`—`}</p>
      <p class="wiz-preview-note">
        ${s?`Then adjusted for everything due before ${E(n[0]?.end??e.anchorDate)}.`:`The planned figure only — a forecast from your schedule, not money you have.`}
      </p>
    </div>`}function St(e,t){let n=e.step;return`
    <div class="wizard">
      <header class="wiz-header">
        <h1>Fortify</h1>
        <p class="wiz-progress">Step ${n} of 3</p>
      </header>

      <div class="wiz-card">
        <div class="wiz-form">
          <h2>${yt[n]}</h2>
          <p class="wiz-blurb">${bt[n]}</p>

          ${n===1?`
            <label class="field">
              <span>Name this budget</span>
              <input type="text" id="wizName" value="${O(e.name)}"
                maxlength="60" autocomplete="off">
            </label>
            <label class="field">
              <span>How often you are paid</span>
              <select id="wizCadence">
                ${vt.map(([t,n])=>`<option value="${t}"${e.cadence===t?` selected`:``}>${n}</option>`).join(``)}
              </select>
            </label>
            <label class="field">
              <span>Your most recent payday</span>
              <input type="date" id="wizAnchor" value="${e.anchorDate}">
              <small>Every cycle is counted from this date.</small>
            </label>`:``}

          ${n===2?`
            <label class="field">
              <span>What is it called</span>
              <input type="text" id="wizIncomeLabel" value="${O(e.incomeLabel)}"
                placeholder="Salary, Wages, Pension…" maxlength="60" autocomplete="off">
            </label>
            <label class="field">
              <span>How much lands each time</span>
              <span class="balance-input-wrap">
                <span class="currency">$</span>
                <input type="number" id="wizIncomeAmount" step="0.01" min="0"
                  value="${O(e.incomeAmount)}" placeholder="0.00">
              </span>
              <small>Take-home, after tax.</small>
            </label>`:``}

          ${n===3?`
            <label class="field">
              <span>Balance in your spending account</span>
              <span class="balance-input-wrap">
                <span class="currency">$</span>
                <input type="number" id="wizBalance" step="0.01" min="0"
                  value="${O(e.balance)}" placeholder="0.00">
              </span>
              <small>Optional — you can add it any time from the main screen.</small>
            </label>`:``}

          ${t===null?``:`<p class="dialog-error">${O(t)}</p>`}

          <div class="wiz-actions">
            ${n>1?`<button type="button" class="ghost-btn" id="wizBack">Back</button>`:``}
            <span class="spacer"></span>
            <button type="button" class="primary-btn" id="wizNext">
              ${n===3?`Finish`:`Next`}
            </button>
          </div>
        </div>

        ${xt(e,n)}
      </div>

      <p class="wiz-escape">
        Just looking? <button type="button" class="link-btn" id="wizSample">Load an example budget</button>
      </p>
    </div>`}function Ct(e,t){let n=t=>e.querySelector(`#${t}`)?.value;return{...t,name:n(`wizName`)??t.name,cadence:n(`wizCadence`)??t.cadence,anchorDate:n(`wizAnchor`)??t.anchorDate,incomeLabel:n(`wizIncomeLabel`)??t.incomeLabel,incomeAmount:n(`wizIncomeAmount`)??t.incomeAmount,balance:n(`wizBalance`)??t.balance}}function wt(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function Tt(e,t){let n=t.trim();return n===``?e:{...e,name:n}}function Et(e,t){let n=wt(t);return{...e,safetyBuffer:n??0}}function Dt(e,t,n){let r=wt(t);return{...e,mainBalance:r===null?null:{amount:r,asOfDateTime:n}}}function Ot(e,t,n){return e.mainBalance===null||!/^\d{4}-\d{2}-\d{2}$/.test(t)?e:{...e,mainBalance:{...e.mainBalance,asOfDateTime:t>n?n:t}}}function kt(e){return Object.keys(e.livingEstimates).length>0||Object.keys(e.potContributions).length>0||e.generators.some(At)}function At(e){switch(e.kind){case`recurring`:return(e.overrides??[]).some(e=>e.fundedFrom?.kind===`window`);case`irregular`:return e.dates.some(e=>e.fundedFrom?.kind===`window`);case`one-off`:return e.fundedFrom?.kind===`window`}}function jt(e){let t=e=>{if(e.fundedFrom?.kind!==`window`)return e;let{fundedFrom:t,...n}=e;return n};switch(e.kind){case`recurring`:return e.overrides===void 0?e:{...e,overrides:e.overrides.map(t)};case`irregular`:return{...e,dates:e.dates.map(t)};case`one-off`:return t(e)}}function Mt(e,t,n){return e.anchorDate===t&&e.anchorCadence===n?e:{...e,anchorDate:t,anchorCadence:n,livingEstimates:{},potContributions:{},generators:e.generators.map(jt)}}function Nt(e){let t=y(e,-4);return{id:`sample`,name:`Household`,anchorDate:t,anchorCadence:`fortnightly`,safetyBuffer:150,livingEstimates:{0:780},potContributions:{0:{rego:60,christmas:40}},mainBalance:{amount:2140.55,asOfDateTime:y(e,-2)},pots:[{id:`bills`,name:`Future bills`,balance:{amount:540,asOfDateTime:y(e,-2)},targetAmount:null,targetDate:null,mode:`passive`},{id:`rego`,name:`Car registration`,balance:{amount:260,asOfDateTime:y(e,-2)},targetAmount:680,targetDate:y(e,180),mode:`active`},{id:`christmas`,name:`Christmas`,balance:{amount:120,asOfDateTime:y(e,-2)},targetAmount:null,targetDate:null,mode:`passive`}],generators:[{id:`salary`,kind:`recurring`,label:`Salary`,entryType:`income`,amountKind:`fixed`,recurrence:{every:2,unit:`week`},amount:2865,startDate:t,status:`confirmed`},{id:`rent`,kind:`recurring`,label:`Rent`,entryType:`expense`,amountKind:`fixed`,recurrence:{every:2,unit:`week`},amount:650,startDate:y(t,1),status:`confirmed`},{id:`power`,kind:`recurring`,label:`Power`,entryType:`expense`,amountKind:`variable`,recurrence:{every:1,unit:`month`},amount:185.4,startDate:y(e,6),status:`expected`},{id:`phone`,kind:`recurring`,label:`Phone & internet`,entryType:`expense`,amountKind:`fixed`,recurrence:{every:1,unit:`month`},amount:99,startDate:y(e,11),status:`confirmed`,overrides:[{date:y(e,11),fundedFrom:{kind:`window`,index:0}}]},{id:`creditcard`,kind:`recurring`,label:`Credit card`,entryType:`expense`,amountKind:`variable`,recurrence:{every:1,unit:`month`},amount:320,startDate:y(e,9),status:`expected`},{id:`streaming`,kind:`recurring`,label:`Streaming`,entryType:`expense`,amountKind:`fixed`,recurrence:{every:1,unit:`month`},amount:22.99,startDate:y(e,4),status:`confirmed`,overrides:[{date:y(e,4),fundedFrom:{kind:`external`}}]},{id:`childcare`,kind:`recurring`,label:`Childcare`,entryType:`expense`,amountKind:`fixed`,recurrence:{every:1,unit:`week`},amount:180,startDate:y(e,2),status:`confirmed`},{id:`invoice`,kind:`one-off`,label:`Freelance invoice #114`,entryType:`income`,amountKind:`fixed`,date:y(e,5),amount:620,status:`expected`},{id:`rental`,kind:`recurring`,label:`Rental income`,entryType:`income`,amountKind:`fixed`,recurrence:{every:1,unit:`month`},amount:430,startDate:y(e,8),status:`confirmed`},{id:`rego-bill`,kind:`recurring`,label:`Car registration`,entryType:`expense`,amountKind:`fixed`,recurrence:{every:1,unit:`year`},amount:680,startDate:y(e,180),status:`confirmed`,overrides:[{date:y(e,180),fundedFrom:{kind:`pot`,potId:`rego`}}]},{id:`insurance`,kind:`irregular`,label:`Car insurance`,entryType:`expense`,amountKind:`fixed`,dates:[{date:y(e,30),amount:140,status:`confirmed`,fundedFrom:{kind:`pot`,potId:`bills`}},{date:y(e,61),amount:110,status:`expected`},{date:y(e,92),amount:110,status:`expected`}]}]}}var Pt=[`weekly`,`fortnightly`,`four-weekly`,`monthly`];function Ft(e){return{...e,generators:e.generators.map(e=>{if(e.kind!==`recurring`||Ce(e.recurrence))return e;let t=e.frequency,n=Pt.includes(t)?we(t):{every:1,unit:`month`},{frequency:r,...i}=e;return{...i,recurrence:n}})}}var It=[`weekly`,`fortnightly`,`four-weekly`,`monthly`];function M(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function N(e){return typeof e==`string`&&/^\d{4}-\d{2}-\d{2}/.test(e)}function P(e){return typeof e==`number`&&Number.isFinite(e)}function Lt(e){return e===null||M(e)&&P(e.amount)&&N(e.asOfDateTime)}function Rt(e){return M(e)?typeof e.id==`string`&&typeof e.name==`string`&&Lt(e.balance)&&(e.targetAmount===null||P(e.targetAmount))&&(e.targetDate===null||N(e.targetDate))&&(e.mode===`active`||e.mode===`passive`):!1}function zt(e){if(!M(e)||typeof e.id!=`string`||typeof e.label!=`string`||e.entryType!==`income`&&e.entryType!==`expense`||e.amountKind!==`fixed`&&e.amountKind!==`variable`)return!1;switch(e.kind){case`recurring`:return P(e.amount)&&N(e.startDate)&&(Ce(e.recurrence)||It.includes(e.frequency));case`one-off`:return P(e.amount)&&N(e.date);case`irregular`:return Array.isArray(e.dates)&&e.dates.every(e=>M(e)&&N(e.date)&&P(e.amount));default:return!1}}function Bt(e){return M(e)&&Object.values(e).every(P)}function Vt(e){return M(e)&&Object.values(e).every(Bt)}function Ht(e){let t;try{t=JSON.parse(e)}catch{return{ok:!1,error:`That file isn't valid JSON.`}}if(!M(t))return{ok:!1,error:`That file isn't a Fortify backup.`};let n=t.schemaVersion;if(typeof n!=`number`)return{ok:!1,error:`That file isn't a Fortify backup.`};if(n>2)return{ok:!1,error:`That backup was saved by a newer version of Fortify (format ${n}). Update Fortify and try again.`};let r=t.budget;return M(r)?typeof r.id!=`string`||typeof r.name!=`string`?{ok:!1,error:`That backup is missing its budget details.`}:!N(r.anchorDate)||!It.includes(r.anchorCadence)?{ok:!1,error:`That backup has no valid pay cycle.`}:!P(r.safetyBuffer)||!Lt(r.mainBalance)?{ok:!1,error:`That backup has an invalid balance or buffer.`}:!Array.isArray(r.pots)||!r.pots.every(Rt)?{ok:!1,error:`That backup has an invalid savings pot.`}:!Array.isArray(r.generators)||!r.generators.every(zt)?{ok:!1,error:`That backup has an invalid income or expense.`}:Bt(r.livingEstimates)?Vt(r.potContributions)?{ok:!0,budget:Ft(r)}:{ok:!1,error:`That backup has invalid savings contributions.`}:{ok:!1,error:`That backup has invalid living expenses.`}:{ok:!1,error:`That backup has no budget in it.`}}function Ut(e){let t={schemaVersion:2,exportedAt:new Date().toISOString(),budget:e};return JSON.stringify(t,null,2)}function Wt(e,t){return`fortify-${e.name.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)||`budget`}-${t}.json`}var Gt=`fortify`,Kt=2,F=`budgets`,I=`usage`,qt=`current`;function Jt(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error??Error(`IndexedDB request failed`))})}function Yt(){return new Promise((e,t)=>{if(typeof indexedDB>`u`){t(Error(`This browser has no local storage available.`));return}let n;try{n=indexedDB.open(Gt,Kt)}catch{t(Error(`Local storage is blocked in this browser.`));return}n.onupgradeneeded=()=>{let e=n.result;e.objectStoreNames.contains(F)||e.createObjectStore(F,{keyPath:`key`}),e.objectStoreNames.contains(I)||e.createObjectStore(I,{keyPath:`seq`,autoIncrement:!0})},n.onsuccess=()=>{let t=n.result;t.onversionchange=()=>t.close(),e(t)},n.onblocked=()=>t(Error(`Another Fortify tab is open. Close it and reload.`)),n.onerror=()=>t(Error(`Couldn't open local storage — it may be turned off.`))})}async function Xt(e,t){let n={key:qt,schemaVersion:2,savedAt:new Date().toISOString(),budget:t};await new Promise((t,r)=>{let i=e.transaction(F,`readwrite`);i.objectStore(F).put(n),i.oncomplete=()=>t(),i.onabort=()=>r(i.error??Error(`Save was cancelled — storage may be full.`)),i.onerror=()=>r(i.error??Error(`Save failed.`))})}async function Zt(e){let t=await Jt(e.transaction(F,`readonly`).objectStore(F).get(qt));if(t===void 0)return null;if(t.schemaVersion>2)throw Error(`Your saved budget was written by a newer version of Fortify. Update to open it.`);return Ft(t.budget)}async function Qt(e,t){await new Promise(n=>{try{let r=e.transaction(I,`readwrite`);r.objectStore(I).add(t),r.oncomplete=()=>n(),r.onerror=()=>n(),r.onabort=()=>n()}catch{n()}})}async function $t(e){return(await Jt(e.transaction(I,`readonly`).objectStore(I).getAll())).map(({seq:e,...t})=>t)}async function en(e){await new Promise((t,n)=>{let r=e.transaction(I,`readwrite`);r.objectStore(I).clear(),r.oncomplete=()=>t(),r.onerror=()=>n(r.error)})}var tn=[`entry_added`,`entry_edited`,`entry_deleted`,`pot_added`,`pot_edited`,`pot_deleted`,`settings_saved`];function nn(e){return e.slice(0,10)}function rn(e){if(e.length===0)return null;let t=[...e].sort((e,t)=>e-t),n=Math.floor(t.length/2);return t.length%2==1?t[n]??null:((t[n-1]??0)+(t[n]??0))/2}function an(e,t){let n=Date.parse(`${t}T00:00:00Z`)-Date.parse(`${e}T00:00:00Z`);return Math.round(n/864e5)}function on(e){let t={};for(let n of e)t[n.event]=(t[n.event]??0)+1;let n=[...e].sort((e,t)=>e.at.localeCompare(t.at)),r=[...new Set(n.map(e=>nn(e.at)))].sort(),i=0;for(let e=1;e<r.length;e+=1){let t=an(r[e-1]??``,r[e]??``)-1;t>i&&(i=t)}let a=n.find(e=>e.event===`setup_started`),o=n.find(e=>e.event===`setup_completed`),s=a!==void 0&&o!==void 0?Math.round((Date.parse(o.at)-Date.parse(a.at))/6e4*10)/10:null,c=n.filter(e=>e.event===`opened`&&e.balanceAgeDays!==void 0).map(e=>e.balanceAgeDays),l=new Set(n.filter(e=>e.cycleIndex!==void 0).map(e=>e.cycleIndex)),u=e=>t[e]??0;return{firstSeen:n[0]?.at??null,lastSeen:n.at(-1)?.at??null,activeDays:r.length,longestGapDays:i,cyclesVisited:l.size,setupMinutes:s,balanceUpdates:u(`balance_updated`),medianBalanceAgeDays:rn(c),amountsEntered:u(`amount_entered`),markedPaid:u(`marked_paid`),fundingChanges:u(`funding_changed`),contributionsSet:u(`contribution_set`),edits:tn.reduce((e,t)=>e+u(t),0),modeViews:{plan:u(`mode_viewed_plan`),safe:u(`mode_viewed_safe`),expected:u(`mode_viewed_expected`)},exports:u(`exported`),imports:u(`imported`),totalEvents:e.length,counts:t}}function sn(e){let t={kind:`fortify-usage`,schemaVersion:1,exportedAt:new Date().toISOString(),summary:on(e),events:e};return JSON.stringify(t,null,2)}function cn(e){switch(e.kind){case`saving`:return`<span class="save-state">Saving…</span>`;case`saved`:return`<span class="save-state is-saved" title="Saved to this browser at ${O(e.at)}">Saved</span>`;case`error`:return`<span class="save-state is-error" title="${O(e.message)}">Not saved</span>`;case`unavailable`:return`<span class="save-state is-error" title="${O(e.message)}">Not saving</span>`}}function ln(e,t){return e.summary.hasBalance?t:`plan`}function un(e,t){let{summary:n}=e;return t===`safe`?n.conservative??n.plan:t===`expected`?n.expected??n.plan:n.plan}function dn(e,t){let n=D(e.summary.nextAnchorDate);return t===`plan`?`Planned surplus for this pay cycle. This is a forecast from your schedule, not money you have.`:t===`safe`?`Estimated safe to spend until ${n}, from confirmed money only.`:`Expected to spend until ${n}, including income that is not confirmed yet.`}function fn(e,t){let n=!e.summary.hasBalance,r=(e,n,r)=>`
    <button class="mode-tab${t===e?` active`:``}" data-mode="${e}"
      ${r?`disabled`:``}
      ${r?`title="Add your current balance to see this"`:``}>
      ${n}
    </button>`;return`<div class="mode-tabs" role="tablist">
    ${r(`plan`,`Plan`,!1)}
    ${r(`safe`,`Safe to spend`,n)}
    ${r(`expected`,`Expected`,n)}
  </div>`}function pn(e,t,n,r){let{summary:i}=e,a=i.balanceAgeDays!==null&&i.balanceAgeDays>7;return`
    <div class="balance-control${i.hasBalance?``:` is-empty`}">
      <label class="balance-field">
        <span class="balance-label">Balance in your account</span>
        <span class="balance-input-wrap">
          <span class="currency">$</span>
          <input
            type="number" inputmode="decimal" step="0.01" min="0"
            id="balanceInput"
            value="${t??``}"
            placeholder="Add yours"
            aria-label="Current balance in your spending account">
        </span>
      </label>
      ${i.hasBalance?`<label class="balance-field">
              <span class="balance-label">as of</span>
              <input type="date" id="balanceDate" value="${n??``}" max="${r}"
                aria-label="Date this balance was read">
            </label>`:``}
      <span class="balance-note${a?` is-stale`:``}">
        ${i.hasBalance&&i.balanceAgeDays!==null?`${tt(i.balanceAgeDays)}${a?` — worth refreshing`:``}`:`Without this, only the plan figure is available`}
      </span>
    </div>`}function mn(e,t){return`
    <dialog id="settingsDialog" class="dialog">
      <form method="dialog" class="dialog-body">
        <h2>Settings</h2>

        <label class="field">
          <span>Budget name</span>
          <input type="text" id="setName" value="${O(t.name)}" maxlength="60">
        </label>

        <label class="field">
          <span>How often you are paid</span>
          <select id="setCadence">
            ${[[`weekly`,`Weekly`],[`fortnightly`,`Fortnightly`],[`four-weekly`,`Every 4 weeks`],[`monthly`,`Monthly`]].map(([e,n])=>`<option value="${e}"${t.anchorCadence===e?` selected`:``}>${n}</option>`).join(``)}
          </select>
        </label>

        <label class="field">
          <span>A recent payday</span>
          <input type="date" id="setAnchor" value="${t.anchorDate}">
          <small>Every cycle is counted from this date.</small>
        </label>

        <label class="field">
          <span>Safety buffer</span>
          <span class="balance-input-wrap">
            <span class="currency">$</span>
            <input type="number" id="setBuffer" step="0.01" min="0" value="${t.safetyBuffer}">
          </span>
          <small>Held back from safe-to-spend so you are never at exactly zero.</small>
        </label>

        <div class="dialog-actions">
          <button type="submit" value="cancel" class="ghost-btn">Cancel</button>
          <button type="submit" value="save" class="primary-btn" id="saveSettings">Save</button>
        </div>
      </form>

      <div class="dialog-body dialog-section">
        <h3>Helping with testing</h3>
        <p class="field-note">
          Fortify keeps a private note of <em>which</em> things you use and when —
          never any amounts, names or dates from your budget. It stays on this
          device unless you send it.
        </p>
        <div class="dialog-actions">
          <button type="button" class="danger-btn" id="usageClear">Delete log</button>
          <span class="spacer"></span>
          <button type="button" class="ghost-btn" id="usageDownload">Download usage log</button>
        </div>
      </div>
    </dialog>`}function hn(e){let{summary:t}=e,n=[];if(t.hasBalance&&t.balanceAgeDays!==null){let e=t.balanceAgeDays>7;n.push(`<span class="chip${e?` chip-warn`:``}">Balance updated ${tt(t.balanceAgeDays)}</span>`)}else n.push(`<span class="chip chip-warn">No balance recorded</span>`);return n.push(`<span class="chip${t.unconfirmedCount>0?` chip-soft`:``}">${t.unconfirmedCount} unconfirmed ${t.unconfirmedCount===1?`entry`:`entries`}</span>`),n.push(`<span class="chip">Buffer ${T(t.safetyBuffer)}</span>`),n.push(`<span class="chip">Savings pots held separately</span>`),`<div class="assumptions">${n.join(``)}</div>`}function gn(e,t){let n=e.planSurplus;return`
    <article class="window-card ${t?`current`:``} ${n<0?`over`:n<300?`tight`:``}">
      <p class="wc-label">${D(e.start)}</p>
      <p class="wc-date">to ${E(e.end)}</p>
      <dl class="wc-stats">
        <div><dt>In</dt><dd class="pos">${T(e.confirmedIncome+e.expectedIncome)}</dd></div>
        <div><dt>Automatic</dt><dd class="neg">${T(e.fixedExpenses)}</dd></div>
        <div><dt>Manual</dt><dd class="neg">${T(e.variableExpenses)}</dd></div>
        <div class="wc-net"><dt>Left over</dt><dd class="${n<0?`neg`:`pos`}">${T(n)}</dd></div>
      </dl>
    </article>`}function _n(e,t,n){if(e.entryType===`income`)return`<td class="cell-assign"></td>`;let r=e=>e?` selected`:``,i=e.funding,a=t.map(e=>`<option value="window:${e.index}"${r(i.kind===`window`&&i.index===e.index)}>${E(e.start)}</option>`).join(``),o=n.map(e=>`<option value="pot:${O(e.id)}"${r(i.kind===`pot`&&i.potId===e.id)}>${O(e.name)}</option>`).join(``);return`
    <td class="cell-assign">
      <select class="${i.kind===`pot`?`assign from-pot`:i.kind===`external`?`assign external`:`assign`}" data-entry="${O(e.id)}" aria-label="Paid from">
        <optgroup label="Pay cycle">${a}</optgroup>
        ${o?`<optgroup label="From a pot">${o}</optgroup>`:``}
        <option value="external"${r(i.kind===`external`)}>N/A — paid elsewhere</option>
      </select>
    </td>`}function vn(e){let t=e.isSettled?`settled`:e.status;return e.entryType===`expense`&&e.amountKind===`variable`?`
      <td>
        <label class="paid-check${e.isSettled?` is-paid`:``}">
          <input type="checkbox" data-paid="${O(e.id)}"${e.isSettled?` checked`:``}>
          <span>${e.isSettled?`Paid`:`Mark paid`}</span>
        </label>
      </td>`:`<td><span class="status status-${t}">${e.statusLabel}</span></td>`}function yn(e,t,n){let r=e.entryType===`income`,i=`
    <div class="amount-entry${e.isEstimate?` is-estimate`:``}">
      <span class="currency">$</span>
      <input
        type="number" inputmode="decimal" step="0.01" min="0"
        class="amount-input"
        data-entry="${O(e.id)}"
        value="${e.isEstimate?``:e.amount}"
        placeholder="${e.amount.toFixed(2)}"
        aria-label="Amount for ${O(e.label)}"
        title="${e.isEstimate?`Estimated — enter the real amount when the bill arrives`:`Actual amount`}">
    </div>`,a=r?`<td class="cell-amount pos" colspan="2">+${T(e.amount)}</td>`:e.amountKind===`fixed`?`<td class="cell-amount neg">${T(e.amount)}</td>
         <td class="cell-amount muted">—</td>`:`<td class="cell-amount muted">—</td>
         <td class="cell-amount">${i}</td>`;return`
    <tr class="${[r?`row-income`:``,e.fundingNote===null?``:`row-elsewhere`].filter(Boolean).join(` `)}">
      <td class="cell-date">${E(e.date)}</td>
      <td class="cell-label">
        <button type="button" class="label-edit" data-edit-generator="${O(e.generatorId)}"
          title="Edit ${O(e.label)}">${O(e.label)}</button>
        ${e.fundingNote===null?``:`<span class="funding-note">${O(e.fundingNote)}</span>`}
      </td>
      ${a}
      ${_n(e,t,n)}
      ${vn(e)}
    </tr>`}function bn(e){let t=e.planSurplus,n=e.livingEstimate,r=e.leftAfterLiving;return`
    <tfoot>
      <tr class="totals-row">
        <td colspan="2">Cycle subtotal</td>
        <td class="cell-amount neg">${e.fixedExpenses>0?T(e.fixedExpenses):`—`}</td>
        <td class="cell-amount neg">${e.variableExpenses>0?T(e.variableExpenses):`—`}</td>
        <td></td>
        <td class="cell-total neg">${T(e.chargedExpenses)} out</td>
      </tr>
      <tr class="pots-row">
        <td colspan="2">Into savings</td>
        <td colspan="3">
          <div class="pot-contribs">
            ${e.contributions.map(t=>`
                <label class="contrib">
                  <span class="contrib-name">${O(t.name)}</span>
                  <span class="currency">$</span>
                  <input
                    type="number" inputmode="decimal" step="0.01" min="0"
                    class="contrib-input"
                    data-window="${e.index}"
                    data-pot="${O(t.potId)}"
                    value="${t.amount===0?``:t.amount}"
                    placeholder="0.00"
                    ${t.carriedForward?`title="Carrying forward from an earlier pay. Change it here and it applies from this cycle on."`:``}
                    aria-label="Into ${O(t.name)} from this pay">
                </label>`).join(``)}
          </div>
        </td>
        <td class="cell-total ${e.totalContributions>0?`saved`:`muted`}">
          ${e.totalContributions>0?`${T(e.totalContributions)} saved`:`—`}
        </td>
      </tr>
      <tr class="living-row">
        <td colspan="2">Est. living expenses</td>
        <td class="cell-amount muted">—</td>
        <td class="cell-amount">
          <div class="amount-entry living-entry">
            <span class="currency">$</span>
            <input
              type="number" inputmode="decimal" step="0.01" min="0"
              class="living-input"
              data-window="${e.index}"
              value="${n??``}"
              placeholder="0.00"
              ${e.livingEstimateCarriedForward?`title="Carrying forward from an earlier pay. Change it here and it applies from this cycle on."`:``}
              aria-label="Estimated living expenses for this cycle">
          </div>
        </td>
        <td></td>
        <td class="cell-hint">Food, fuel, etc. — carries forward</td>
      </tr>
      <tr class="net-row">
        <td colspan="2">${n===null?`Left over`:`Left over after living`}</td>
        <td colspan="3" class="cell-hint">
          ${n===null?``:`${T(t)} less ${T(n)}`}
        </td>
        <td class="cell-total ${(r??t)<0?`neg`:`pos`}">${T(r??t)}</td>
      </tr>
    </tfoot>`}var xn=`
  <thead>
    <tr>
      <th>Date</th>
      <th>What</th>
      <th class="r">Automatic</th>
      <th class="r">Manual</th>
      <th>Paid from</th>
      <th>Status</th>
    </tr>
  </thead>`;function Sn(e,t,n){let r=[...e.income,...e.expenses].sort((e,t)=>e.date.localeCompare(t.date)),i=r.length?r.map(e=>yn(e,t,n)).join(``):`<tr><td colspan="6" class="empty">Nothing scheduled in this window.</td></tr>`;return`
    <section class="window-section">
      <header class="ws-header">
        <h3>${D(e.start)}</h3>
        <span class="ws-range">${E(e.start)} – ${E(e.end)}</span>
        <span class="ws-net ${e.planSurplus<0?`neg`:`pos`}">${T(e.planSurplus)}</span>
      </header>
      <div class="table-scroll">
        <table class="ledger">
          ${xn}
          <tbody>${i}</tbody>
          ${bn(e)}
        </table>
      </div>
    </section>`}function Cn(e){let{progress:t}=e,n=t.target===null||t.target===0?null:Math.min(100,t.balance/t.target*100),r=[];return t.target===null?r.push(`Set aside, no target`):t.isFunded?r.push(`Fully funded`):(r.push(`${T(t.remaining??0)} to go`),t.requiredPerCycle!==null&&t.requiredPerCycle>0&&r.push(`${T(t.requiredPerCycle)} per cycle`),t.isOverdue&&r.push(`target date passed`)),`
    <article class="pot${t.isOverdue?` pot-overdue`:``}">
      <div class="pot-head">
        <h4><button type="button" class="label-edit" data-edit-pot="${O(e.id)}"
          title="Edit ${O(e.name)}">${O(e.name)}</button></h4>
        <span class="pot-balance">${T(t.balance)}${t.target===null?``:` <span class="pot-target">of ${T(t.target)}</span>`}</span>
      </div>
      ${n===null?``:`<div class="pot-bar"><span style="width:${n.toFixed(1)}%"></span></div>`}
      <p class="pot-detail">${r.join(` · `)}</p>
    </article>`}function wn(e,t,n){return e.length===0?``:`
    <section class="window-section">
      <header class="ws-header">
        <h3>Further ahead</h3>
        <span class="ws-range">Beyond the cycles above</span>
      </header>
      <div class="table-scroll">
        <table class="ledger">${xn}<tbody>${e.slice(0,8).map(e=>yn(e,t,n)).join(``)}</tbody></table>
      </div>
    </section>`}function Tn(e,t){let{budgetName:n,today:r,mode:i,saveState:a,theme:o,settings:s}=t,c=ln(e,i),l=un(e,c);return`
    <header class="app-header">
      <div>
        <h1>Fortify</h1>
        <p class="subtitle">${O(n)} · ${D(r)}</p>
      </div>
      <div class="header-actions">
        ${cn(a)}
        <button class="ghost-btn" id="themeBtn" type="button"
          title="Switch to ${o===`dark`?`light`:`dark`} mode">
          ${o===`dark`?`Light`:`Dark`} mode
        </button>
        <button class="ghost-btn" id="newBudgetBtn" type="button">New budget</button>
        <button class="ghost-btn" id="settingsBtn" type="button">Settings</button>
        <button class="ghost-btn" id="exportBtn" type="button">Export</button>
        <button class="ghost-btn" id="importBtn" type="button">Import</button>
        <span class="prototype-badge">Prototype</span>
      </div>
    </header>

    <section class="runway">
      ${fn(e,c)}
      <p class="runway-figure ${l<0?`neg`:``}">${T(l)}</p>
      <p class="runway-caption">${dn(e,c)}</p>
      ${hn(e)}
      ${pn(e,s.mainBalance,s.balanceAsOf,r)}
    </section>

    <section class="windows">
      ${e.windows.map((e,t)=>gn(e,t===0)).join(``)}
    </section>

    ${`<section class="pots"><div class="section-head"><h2>Savings pots</h2>
        <button type="button" class="ghost-btn" id="addPot">Add a pot</button></div><div class="pot-grid">${e.pots.length?e.pots.map(Cn).join(``):`<p class="empty-note">No savings pots yet. A pot holds money set aside for something later — a rego bill, Christmas.</p>`}</div></section>`}

    <section class="detail">
      <div class="section-head">
        <h2>Spend plan</h2>
        <button type="button" class="ghost-btn" id="addGenerator">Add income or bill</button>
      </div>
      ${e.windows.map(t=>Sn(t,e.windows,e.pots)).join(``)}
      ${wn(e.upcomingBeyond,e.windows,e.pots)}
    </section>

    ${mn(t,s)}`}var En=`fortify.theme`;function Dn(){try{let e=localStorage.getItem(En);return e===`light`||e===`dark`?e:null}catch{return null}}function On(e){try{localStorage.setItem(En,e)}catch{}}function kn(){return window.matchMedia?.(`(prefers-color-scheme: light)`).matches?`light`:`dark`}function An(){return Dn()??kn()}function L(e){document.documentElement.dataset.theme=e}function jn(e){On(e),L(e)}function Mn(e){window.matchMedia?.(`(prefers-color-scheme: light)`).addEventListener(`change`,()=>{Dn()===null&&e(kn())})}var Nn=4,R=document.querySelector(`#app`),z=ee(),B=Nt(z),Pn=!1,Fn=`safe`,V={kind:`saving`},H=null,U=An(),W=null,G=null,K=null,q=null,J=null,Y=null;function X(e,t={}){H!==null&&Qt(H,{event:e,at:new Date().toISOString(),...t})}function In(e){return e instanceof Error?e.message:String(e)}async function Ln(){if(H!==null){V={kind:`saving`};try{await Xt(H,B),V={kind:`saved`,at:new Date().toLocaleTimeString()}}catch(e){V={kind:`error`,message:In(e)}}$()}}function Z(e){B=e,$(),Ln()}async function Rn(){if(H===null)return;let e=await $t(H),t=new Blob([sn(e)],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`fortify-usage-${z}.json`,r.click(),URL.revokeObjectURL(n)}async function zn(){H!==null&&window.confirm(`Delete the usage log? Your budget is not affected.`)&&(await en(H),window.alert(`Usage log deleted.`))}function Bn(){let e=new Blob([Ut(B)],{type:`application/json`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=Wt(B,z),n.click(),URL.revokeObjectURL(t)}function Vn(){let e=document.createElement(`input`);e.type=`file`,e.accept=`application/json,.json`,e.addEventListener(`change`,()=>{let t=e.files?.[0];if(t===void 0)return;let n=new FileReader;n.onload=()=>{let e=Ht(String(n.result));if(!e.ok){window.alert(`Couldn't import that file.\n\n${e.error}`);return}window.confirm(`Replace your current budget with "${e.budget.name}"?\n\nEverything currently in Fortify will be overwritten.`)&&(X(`imported`),Z(e.budget))},n.onerror=()=>window.alert(`Couldn't read that file.`),n.readAsText(t)}),e.click()}function Hn(e){let t=t=>e.querySelector(`#${t}`)?.value??``,n=t(`setAnchor`),r=t(`setCadence`),i=n!==``&&(n!==B.anchorDate||r!==B.anchorCadence);if(i&&kt(B)&&!window.confirm(`Changing your pay cycle clears anything tied to a particular cycle — living expense estimates, savings contributions, and bills you assigned to a specific pay.

Your income, bills and pots are kept. Continue?`))return;X(`settings_saved`);let a=Tt(B,t(`setName`));a=Et(a,t(`setBuffer`)),i&&(a=Mt(a,n,r)),Z(a)}function Un(){let e=document.querySelector(`#generatorDialog`);e!==null&&W!==null&&(W={...W,draft:A(e,W.draft)}),$()}function Wn(e){let t=B.generators.find(t=>t.id===e);G=null,W=t===void 0?{draft:{...Xe(z),id:C(`gen`)},isNew:!0}:{draft:Ze(t,z),isNew:!1},$()}function Gn(){W=null,G=null,$()}function Kn(){let e=document.querySelector(`#generatorDialog`);if(e===null||W===null)return;let t=A(e,W.draft),n=Qe(t);if(!n.ok){W={...W,draft:t},G=n.error,$();return}X(W.isNew?`entry_added`:`entry_edited`);let r=W.isNew?Ve(B,n.generator):He(B,n.generator);W=null,G=null,Z(r)}function qn(){if(W===null||W.isNew)return;let e=W.draft.label||`this entry`;if(!window.confirm(`Delete ${e}? Every occurrence of it goes too.`))return;X(`entry_deleted`);let t=Ue(B,W.draft.id);W=null,Z(t)}function Jn(){let e=document.querySelector(`#generatorDialog`);if(e===null||W===null)return;e.open||e.showModal();let t=e.querySelector(`#genError`);t!==null&&G!==null&&(t.textContent=G,t.hidden=!1),e.querySelectorAll(`input[name="genKind"], input[name="genAmountKind"]`).forEach(e=>e.addEventListener(`change`,Un)),e.querySelector(`#addInstalment`)?.addEventListener(`click`,()=>{if(W===null)return;let t=A(e,W.draft);W={...W,draft:{...t,instalments:[...t.instalments,{date:z,amount:``}]}},$()}),e.querySelectorAll(`[data-inst-remove]`).forEach(t=>{t.addEventListener(`click`,()=>{if(W===null)return;let n=Number(t.dataset.instRemove),r=A(e,W.draft);W={...W,draft:{...r,instalments:r.instalments.filter((e,t)=>t!==n)}},$()})}),e.querySelector(`#genSave`)?.addEventListener(`click`,Kn),e.querySelector(`#genCancel`)?.addEventListener(`click`,Gn),e.querySelector(`#genDelete`)?.addEventListener(`click`,qn),e.addEventListener(`cancel`,e=>{e.preventDefault(),Gn()})}function Yn(e){let t=B.pots.find(t=>t.id===e);q=null,K=t===void 0?{draft:{...ot(z),id:C(`pot`)},isNew:!0}:{draft:st(t,z),isNew:!1},$()}function Xn(){let e=document.querySelector(`#potDialog`);if(e===null||K===null)return;let t=dt(e,K.draft),n=ct(t,z);if(!n.ok){K={...K,draft:t},q=n.error,$();return}X(K.isNew?`pot_added`:`pot_edited`);let r=K.isNew?We(B,n.pot):Ge(B,n.pot);K=null,q=null,Z(r)}function Zn(){if(K===null||K.isNew)return;let e=K.draft.name||`this pot`;if(!window.confirm(`Delete ${e}? Anything paid from it goes back to being paid from its own pay cycle.`))return;X(`pot_deleted`);let t=qe(B,K.draft.id);K=null,Z(t)}function Qn(){let e=document.querySelector(`#potDialog`);if(e===null||K===null)return;e.open||e.showModal();let t=e.querySelector(`#potError`);t!==null&&q!==null&&(t.textContent=q,t.hidden=!1),e.querySelectorAll(`input[name="potMode"]`).forEach(t=>t.addEventListener(`change`,()=>{K!==null&&(K={...K,draft:dt(e,K.draft)},$())})),e.querySelector(`#potSave`)?.addEventListener(`click`,Xn),e.querySelector(`#potCancel`)?.addEventListener(`click`,()=>{K=null,q=null,$()}),e.querySelector(`#potDelete`)?.addEventListener(`click`,Zn),e.addEventListener(`cancel`,e=>{e.preventDefault(),K=null,q=null,$()})}function $n(){return!R||J===null?null:Ct(R,J)}function er(e){let t=$n();if(t!==null){if(e>0){let e=mt(t,t.step);if(e!==null){J=t,Y=e,$();return}}if(e>0&&t.step===3){J=null,Y=null,X(`setup_completed`),Z(_t(t,z));return}J={...t,step:Math.max(1,t.step+e)},Y=null,$()}}function tr(){!R||J===null||(R.innerHTML=St(J,Y),R.querySelectorAll(`input, select`).forEach(e=>{e.addEventListener(`change`,()=>{let e=$n();e!==null&&(J=e,$())})}),R.querySelector(`#wizNext`)?.addEventListener(`click`,()=>{er(1)}),R.querySelector(`#wizBack`)?.addEventListener(`click`,()=>{er(-1)}),R.querySelector(`#wizSample`)?.addEventListener(`click`,()=>{J=null,Y=null,X(`sample_loaded`),Z(Nt(z))}))}function Q(){return S(z,B.anchorDate,B.anchorCadence)}function $(){if(!R||!Pn)return;if(J!==null){tr();return}R.innerHTML=Tn(Be(B,z,Nn),{budgetName:B.name,today:z,mode:Fn,saveState:V,theme:U,settings:{name:B.name,anchorDate:B.anchorDate,anchorCadence:B.anchorCadence,safetyBuffer:B.safetyBuffer,mainBalance:B.mainBalance?.amount??null,balanceAsOf:B.mainBalance?.asOfDateTime.slice(0,10)??null}}),W!==null&&R.insertAdjacentHTML(`beforeend`,rt(W.draft,W.isNew)),K!==null&&R.insertAdjacentHTML(`beforeend`,ut(K.draft,K.isNew,Je(B,K.draft.id))),R.querySelectorAll(`.mode-tab`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.mode;(t===`plan`||t===`safe`||t===`expected`)&&(Fn=t,X(`mode_viewed_${t}`,{cycleIndex:Q()}),$())})}),R.querySelectorAll(`.assign`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.entry;t!==void 0&&(X(`funding_changed`,{cycleIndex:Q()}),Z(d(B,t,e.value)))})}),R.querySelectorAll(`.amount-input`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.entry;t!==void 0&&(X(`amount_entered`,{cycleIndex:Q()}),Z(f(B,t,e.value)))})}),R.querySelectorAll(`.living-input`).forEach(e=>{e.addEventListener(`change`,()=>{let t=Number(e.dataset.window);Number.isInteger(t)&&(X(`living_set`,{cycleIndex:t}),Z(m(B,t,e.value)))})}),R.querySelectorAll(`.contrib-input`).forEach(e=>{e.addEventListener(`change`,()=>{let t=Number(e.dataset.window),n=e.dataset.pot;!Number.isInteger(t)||n===void 0||(X(`contribution_set`,{cycleIndex:t}),Z(h(B,t,n,e.value)))})}),R.querySelectorAll(`[data-paid]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.paid;t!==void 0&&(X(e.checked?`marked_paid`:`unmarked_paid`,{cycleIndex:Q()}),Z(p(B,t,e.checked,z)))})}),R.querySelector(`#balanceInput`)?.addEventListener(`change`,e=>{let t=e.currentTarget;X(`balance_updated`,{cycleIndex:Q()}),Z(Dt(B,t.value,z))}),R.querySelector(`#balanceDate`)?.addEventListener(`change`,e=>{let t=e.currentTarget;Z(Ot(B,t.value,z))});let e=R.querySelector(`#settingsDialog`);R.querySelector(`#settingsBtn`)?.addEventListener(`click`,()=>{e?.showModal()}),R.querySelector(`#newBudgetBtn`)?.addEventListener(`click`,()=>{window.confirm(`Start a new budget? This replaces what is here now, so export a backup first if you want to keep it.`)&&(J=pt(z),Y=null,$())}),e?.addEventListener(`close`,()=>{e.returnValue===`save`&&Hn(e)}),R.querySelector(`#themeBtn`)?.addEventListener(`click`,()=>{U=U===`dark`?`light`:`dark`,jn(U),$()}),R.querySelector(`#exportBtn`)?.addEventListener(`click`,()=>{X(`exported`),Bn()}),R.querySelector(`#importBtn`)?.addEventListener(`click`,Vn),R.querySelector(`#usageDownload`)?.addEventListener(`click`,()=>{Rn()}),R.querySelector(`#usageClear`)?.addEventListener(`click`,()=>{zn()}),R.querySelector(`#addGenerator`)?.addEventListener(`click`,()=>{Wn(null)}),R.querySelectorAll(`[data-edit-generator]`).forEach(e=>{e.addEventListener(`click`,()=>{Wn(e.dataset.editGenerator??null)})}),R.querySelector(`#addPot`)?.addEventListener(`click`,()=>{Yn(null)}),R.querySelectorAll(`[data-edit-pot]`).forEach(e=>{e.addEventListener(`click`,()=>{Yn(e.dataset.editPot??null)})}),Jn(),Qn()}function nr(){let e=e=>{let t=e.target;if(!(t instanceof HTMLElement))return;let n=t.closest(`.radio-card`)?.querySelector(`input[type="radio"]`);n!=null&&(n.closest(`dialog`)??document).querySelectorAll(`input[type="radio"][name="${n.name}"]`).forEach(e=>{e.closest(`.radio-card`)?.classList.toggle(`selected`,e.checked)})};document.addEventListener(`change`,e),document.addEventListener(`click`,e)}async function rr(){nr(),L(U),Mn(e=>{U=e,L(e),$()});try{H=await Yt();let e=await Zt(H);if(e===null){J=pt(z),Pn=!0,X(`setup_started`),$();return}B=e,V={kind:`saved`,at:new Date().toLocaleTimeString()};let t=e.mainBalance===null?void 0:Math.max(0,ne(e.mainBalance.asOfDateTime.slice(0,10),z));X(`opened`,{cycleIndex:S(z,e.anchorDate,e.anchorCadence),...t===void 0?{}:{balanceAgeDays:t}})}catch(e){V={kind:`unavailable`,message:In(e)}}Pn=!0,$()}rr();