import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { FilePlusIcon } from "~/components";
import { requireUser } from "~/session.server";
import { getCustomerListItems } from "~/models/customer.server";

type LoaderData = {
  customers: Awaited<ReturnType<typeof getCustomerListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  return json<LoaderData>({
    customers: await getCustomerListItems(),
  });
};

export default function Customers() {
  const { customers } = useLoaderData() as LoaderData;

  // 💿 get the transition from useTransition
  // 💿 determine whether we're transitioning to a customer page
  // 💰 use transition.location?.pathname to get the customer id

  // 💯 to avoid a flash of loading state, you can use useSpinDelay
  // from spin-delay to determine whether to show the skeleton

  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-100">
      <div className="w-1/2 border-r border-gray-100">
        <NavLink
          to="new"
          prefetch="intent"
          className={({ isActive }) =>
            "block border-b-4 border-gray-100 py-3 px-4 hover:bg-gray-50" +
            " " +
            (isActive ? "bg-gray-50" : "")
          }
        >
          <span className="flex gap-1">
            <FilePlusIcon /> <span>Create new customer</span>
          </span>
        </NavLink>
        <div className="max-h-96 overflow-y-scroll">
          {customers.map((customer) => (
            <NavLink
              key={customer.id}
              to={customer.id}
              prefetch="intent"
              className={({ isActive }) =>
                "block border-b border-gray-50 py-3 px-4 hover:bg-gray-50" +
                " " +
                (isActive ? "bg-gray-50" : "")
              }
            >
              <div className="flex justify-between text-[length:14px] font-bold leading-6">
                <div>{customer.name}</div>
              </div>
              <div className="flex justify-between text-[length:12px] font-medium leading-4 text-gray-400">
                <div>{customer.email}</div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex w-1/2 flex-col justify-between">
        {/*
          💿 if we're loading a customer, then render the
          <CustomerSkeleton /> (defined below) instead of
          the <Outlet />
        */}
        <Outlet />
        <small className="p-2 text-center">
          Note: this is arbitrarily slow to demonstrate pending UI.
        </small>
      </div>
    </div>
  );
}

function CustomerSkeleton({ name, email }: { name: string; email: string }) {
  return (
    <div className="relative p-10">
      <div className="text-[length:14px] font-bold leading-6">{email}</div>
      <div className="text-[length:32px] font-bold leading-[40px]">{name}</div>
      <div className="h-4" />
      <div className="text-m-h3 font-bold leading-8">Invoices</div>
      <div className="h-4" />
      <div>
        <div className="flex h-[56px] items-center border-t border-gray-100">
          <div className="h-[14px] w-full animate-pulse rounded bg-gray-300">
            &nbsp;
          </div>
        </div>
        <div className="flex h-[56px] items-center border-t border-gray-100">
          <div className="h-[14px] w-full animate-pulse rounded bg-gray-300">
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  );
}

/*
eslint
  @typescript-eslint/no-unused-vars: "off",
*/
